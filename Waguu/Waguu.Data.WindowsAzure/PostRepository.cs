namespace Waguu.Data.WindowsAzure
{
    using System;
    using System.Collections.Generic;
    using System.Data.Services.Client;
    using System.Diagnostics;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Net;
    using System.Xml.Linq;
    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.StorageClient;
    using Waguu.Data;
    using Waguu.Data.Exceptions;

    public class PostRepository : IPostRepository
    {
        private CloudStorageAccount storageAccount;

        public PostRepository(CloudStorageAccount account)
        {
            this.storageAccount = account;
        }

        public PostRepository()
            : this(CloudStorageAccount.FromConfigurationSetting("DataConnectionString"))
        {
        }

        #region IPostRepository Members

        public IEnumerable<Post> GetAllPosts()
        {
            var context = new PostDataContext();

            // we add the 'true' predicate in order to not get 404 if post is missing (we just want a null)
            return context.Posts.AsTableServiceQuery()
                .AsEnumerable()
                .ToModel();
        }

        public Post GetPostByOwner(string owner, string postId)
        {
            var context = new PostDataContext();

            // use this partial one to correctly construct partition keys
            var temp = new PostRow(new Post { Owner = owner.ToLowerInvariant(), PostId = postId });

            // we add the 'true' predicate in order to not get 404 if post is missing (we just want a null)
            return context.Posts.Where(p => p.PartitionKey == temp.PartitionKey && p.RowKey == temp.RowKey && true).AsTableServiceQuery()
                .AsEnumerable()
                .ToModel()
                .SingleOrDefault();
        }

        public void Add(Post post)
        {
            // get just the file name and ignore the path
            //var file = name.Substring(name.LastIndexOf("\\", StringComparison.OrdinalIgnoreCase) + 1);

            var context = new PostDataContext();

            try
            {
                // add the post to table storage
                context.AddObject(PostDataContext.PostTable, new PostRow(post));
                context.SaveChanges();
            }
            catch (Exception ex)
            {
                if (ex.ToString().Contains("EntityAlreadyExists"))
                {
                    throw new PostNameAlreadyInUseException(post.Owner, post.Title);
                }
                else
                {
                    throw;
                }
            }

            // post a message to the queue so it can process tags and the sizing operations
            this.SendToQueue(
                Constants.PostQueue,
                string.Format(CultureInfo.InvariantCulture, "{0}|{1}|{2}|{3}|{4}", post.Owner, post.PostId, post.Source, post.Content, post.RawContent));
        }

        public void UpdatePostData(Post post)
        {
            var context = new PostDataContext();
            var postRow = new PostRow(post);

            // attach and update the post row
            context.AttachTo(PostDataContext.PostTable, postRow, "*");
            context.UpdateObject(postRow);
            context.SaveChanges();
        }

        public void Delete(string owner, string postId)
        {
            var context = new PostDataContext();

            // we use this to help calculate partition keys, rowkeys in query later
            var temp = new PostRow(new Post { PostId = postId, Owner = owner.ToLowerInvariant() });

            // see if the post exists
            var post = context.Posts.Where(p => p.PartitionKey == temp.PartitionKey && p.RowKey == temp.RowKey && true).AsTableServiceQuery()
                .ToModel()
                .SingleOrDefault();

            if (post != null)
            {
                this.Delete(post);
            }
        }

        public void Delete(Post post)
        {
            var context = new PostDataContext();
            var postRow = new PostRow(post);

            context.AttachTo(PostDataContext.PostTable, postRow, "*");
            context.DeleteObject(postRow);
            context.SaveChanges();

            // tell the worker role to clean up blobs and tags
            this.SendToQueue(
                Constants.PostCleanupQueue,
                string.Format(CultureInfo.InvariantCulture, "{0}|{1}|{2}|{3}|{4}|{5}", post.PostId, post.Owner, post.RawContent, post.RawTags, post.Content));
        }

        public void CreateTags(string postId, Tag[] tags)
        {
            var context = new PostDataContext();

            foreach (var tag in tags)
            {
                // add the tag and associate to a picture for later searching
                context.AddObject(PostDataContext.TagTable, new TagRow(tag));
                context.AddObject(PostDataContext.PostTagTable, new PostTagRow(postId, tag.Name));
            }

            try
            {
                // we want to continue - even if conflict is detected...
                context.SaveChanges(SaveChangesOptions.ContinueOnError);
            }
            catch (DataServiceRequestException ex)
            {
                foreach (var resp in ex.Response)
                {
                    // we might get a conflict here, which is ok (tag exists)
                    // the alternative is to query everytime to see if the tag
                    // exists, which is less efficient that just trying and 
                    // handling exception.
                    if (resp.StatusCode != (int)HttpStatusCode.Conflict
                        && resp.StatusCode != (int)HttpStatusCode.Created)
                    {
                        throw;
                    }
                }
            }
        }

        public void RemoveTags(string postId, Tag[] tags)
        {
            var context = new PostDataContext();

            foreach (var tag in tags)
            {
                var postTag = new PostTagRow(postId, tag.Name);
                context.AttachTo(PostDataContext.PostTagTable, postTag, "*");
                context.DeleteObject(postTag);
            }

            try
            {
                // continue trying to delete, even if not found
                context.SaveChanges(SaveChangesOptions.ContinueOnError);
            }
            catch (DataServiceRequestException ex)
            {
                foreach (var resp in ex.Response)
                {
                    // to be more robust, we will ignore 404 errors when
                    // the entity might have already been deleted (due to an
                    // incomplete operation earliet).
                    if (resp.StatusCode != (int)HttpStatusCode.NotFound
                        && resp.StatusCode != (int)HttpStatusCode.OK)
                    {
                        throw;
                    }
                }
            }
        }

        public IEnumerable<Post> FindPostsByTag(params string[] tags)
        {
            var context = new PostDataContext();

            // we have to dynamically build our query using an Expression tree
            Expression<Func<PostTagRow, bool>> search = null;
            foreach (var tag in tags)
            {
                var id = tag.Trim().ToLowerInvariant();

                if (string.IsNullOrEmpty(id))
                {
                    continue;
                }

                Expression<Func<PostTagRow, bool>> addendum = t => t.PartitionKey == id;

                if (search == null)
                {
                    search = addendum;
                }
                else
                {
                    search = Expression.Lambda<Func<PostTagRow, bool>>(Expression.OrElse(search.Body, addendum.Body), search.Parameters);
                }
            }

            // if we get back entries associated with the tag, we next have to query
            // to find the specific post.
            if (search != null)
            {
                var rows = context.PostTags.Where(search).AsTableServiceQuery();

                Expression<Func<PostRow, bool>> postPredicate = null;
                foreach (var row in rows)
                {
                    var id = row.PostId;
                    Expression<Func<PostRow, bool>> addendum = p => p.RowKey == id;
                    if (postPredicate == null)
                    {
                        postPredicate = addendum;
                    }
                    else
                    {
                        postPredicate = Expression.Lambda<Func<PostRow, bool>>(Expression.OrElse(postPredicate.Body, addendum.Body), postPredicate.Parameters);
                    }
                }

                if (postPredicate != null)
                {
                    return context.Posts.Where(postPredicate).AsTableServiceQuery().ToModel();
                }
            }

            // by default, return an empty (non-null) enumeration
            return (new Post[] { }).AsEnumerable();
        }

        public void BootstrapUser(string userName)
        {
            // create the initial album for the user
            //this.CreateAlbum(albumName, userName.ToLowerInvariant());

            // provision a container for the user's blobs
            var client = this.storageAccount.CreateCloudBlobClient();
            var container = client.GetContainerReference(userName.ToLowerInvariant());

            bool success = container.CreateIfNotExist();

            // set to public access
            container.SetPermissions(
                new BlobContainerPermissions()
                {
                    PublicAccess = BlobContainerPublicAccessType.Container
                });

            if (!success)
            {
                Trace.TraceError("Failed to create container for {0}", userName);
            }
        }

        #endregion

        private void SendToQueue(string queueName, string msg)
        {
            var queues = this.storageAccount.CreateCloudQueueClient();

            // TODO: add error handling and retry logic
            var q = queues.GetQueueReference(queueName);
            q.CreateIfNotExist();
            q.AddMessage(new CloudQueueMessage(msg));
        }
    }
}
