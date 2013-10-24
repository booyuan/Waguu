namespace Waguu.Data.WindowsAzure
{
    using System;
    using System.Globalization;
    using Microsoft.WindowsAzure.StorageClient;

    public class PostRow : TableServiceEntity
    {
        public PostRow()
            : base()
        {
        }

        public PostRow(Post post)
            : base(string.Format(CultureInfo.InvariantCulture, "{0}_{1}", post.Owner, post.AlbumId), post.PostId)
        {
            this.PostId = post.PostId;
            this.Owner = post.Owner;
            this.Title = post.Title;
            this.Description = post.Description;
            this.AlbumId = post.AlbumId;
            this.RawTags = post.RawTags;
            this.Content = post.Content;
            this.RawContent = post.RawContent;
        }

        private PostRow(string partitionKey, string rowKey)
            : base(partitionKey, rowKey)
        {
        }

        public string PostId { get; set; }
        
        public string Title { get; set; }
        
        public string Description { get; set; }
        
        public string RawContent { get; set; }
        
        public string Content { get; set; }
        
        public string AlbumId { get; set; }
        
        public string Owner { get; set; }
        
        public string RawTags { get; set; }
    }
}
