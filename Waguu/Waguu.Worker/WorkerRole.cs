namespace Waguu.Worker
{
    using System;
    using System.Diagnostics;
    using System.Drawing;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Threading;
    using System.Text.RegularExpressions;
    using Microsoft.WindowsAzure;
    using Microsoft.WindowsAzure.Diagnostics;
    using Microsoft.WindowsAzure.ServiceRuntime;
    using Microsoft.WindowsAzure.StorageClient;
    using Waguu.Data;
    using Waguu.Data.WindowsAzure;

    public class WorkerRole : RoleEntryPoint
    {
        private CloudStorageAccount storageAccount;

        public WorkerRole()
        {
            // This code sets up a handler to update CloudStorageAccount instances when their corresponding
            // configuration settings change in the service configuration file.
            CloudStorageAccount.SetConfigurationSettingPublisher((configName, configSetter) =>
            {
                // Provide the configSetter with the initial value
                configSetter(RoleEnvironment.GetConfigurationSettingValue(configName));

                RoleEnvironment.Changed += (sender, arg) =>
                {
                    if (arg.Changes.OfType<RoleEnvironmentConfigurationSettingChange>()
                        .Any((change) => (change.ConfigurationSettingName == configName)))
                    {
                        // The corresponding configuration setting has changed, propagate the value
                        if (!configSetter(RoleEnvironment.GetConfigurationSettingValue(configName)))
                        {
                            // In this case, the change to the storage account credentials in the
                            // service configuration is significant enough that the role needs to be
                            // recycled in order to use the latest settings. (for example, the 
                            // endpoint has changed)
                            RoleEnvironment.RequestRecycle();
                        }
                    }
                };
            });

            this.storageAccount = CloudStorageAccount.FromConfigurationSetting("DataConnectionString");
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2122:DoNotIndirectlyExposeMethodsWithLinkDemands", Justification = "Required to access Windows Azure Environment")]
        public override bool OnStart()
        {
            // Set the maximum number of concurrent connections 
            ServicePointManager.DefaultConnectionLimit = 12;

            // Windows Azure Logs
            var initialConfiguration = DiagnosticMonitor.GetDefaultInitialConfiguration(); 
            initialConfiguration.Logs.ScheduledTransferPeriod = TimeSpan.FromMinutes(5);
            DiagnosticMonitor.Start("Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString", initialConfiguration);

            // For information on handling configuration changes
            // see the MSDN topic at http://go.microsoft.com/fwlink/?LinkId=166357.
            RoleEnvironment.Changing += this.RoleEnvironmentChanging;

            return base.OnStart();
        }

        public override void Run()
        {
            var queueClient = this.storageAccount.CreateCloudQueueClient();

            int sleepTime = GetSleepTimeFromConfig();

            while (true)
            {
                Thread.Sleep(sleepTime);

                foreach (var q in queueClient.ListQueues())
                {
                    var msg = q.GetMessage();
                    var success = false;

                    if (msg != null)
                    {
                        var id = msg.Id;
                        switch (q.Name)
                        {
                            case Constants.PostQueue:
                                Trace.TraceInformation("Starting create post and process tagging");
                                success = this.CreatePost(msg);
                                break;

                            case Constants.PostCleanupQueue:
                                Trace.TraceInformation("Starting post removal and metadata cleanup");
                                success = this.CleanupPost(msg);
                                break;

                            case Constants.TagCleanupQueue:
                                Trace.TraceInformation("Starting album removal and metadata cleanup");
                                success = CleanupTag(msg);
                                break;

                            default:
                                Trace.TraceError("Unknown Queue found: {0}", q.Name);
                                break;
                        }

                        // remove the message if no error has occurred
                        // or delete if the message is poison (> 4 reads)
                        if (success || msg.DequeueCount > 4)
                        {
                            q.DeleteMessage(msg);
                        }
                    }
                }
            }
        }

        private static bool CleanupTag(CloudQueueMessage msg)
        {
            Trace.TraceInformation("CleanupTag called with {0}", msg.AsString);
            var parts = msg.AsString.Split('|');

            if (parts.Length != 2)
            {
                Trace.TraceError("Unexpected input to the Tag cleanup queue: {0}", msg.AsString);
                return false;
            }

            // interpret the message
            var owner = parts[0];
            var tag = parts[1];

            var repository = new PostRepository();

            var posts = repository.FindPostsByTag(owner, tag);

            // this will trigger another message to the queue for more scale!
            foreach (var post in posts)
            {
                repository.Delete(post);
            }

            return true;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Security", "CA2122:DoNotIndirectlyExposeMethodsWithLinkDemands", Justification = "Required to access Windows Azure Environment")]
        private static int GetSleepTimeFromConfig()
        {
            int sleepTime;

            if (!int.TryParse(RoleEnvironment.GetConfigurationSettingValue("WorkerSleepTime"), out sleepTime))
            {
                sleepTime = 0;
            }

            // polling less than a second seems too eager
            if (sleepTime < 1000)
            {
                sleepTime = 2000;
            }

            return sleepTime;
        }

        private void RoleEnvironmentChanging(object sender, RoleEnvironmentChangingEventArgs e)
        {
            // If a configuration setting is changing
            if (e.Changes.Any(change => change is RoleEnvironmentConfigurationSettingChange))
            {
                // Set e.Cancel to true to restart this role instance
                e.Cancel = true;
            }
        }

        private bool CleanupPost(CloudQueueMessage msg)
        {
            Trace.TraceInformation("CleanupPost called with {0}", msg.AsString);
            var parts = msg.AsString.Split('|');

            if (parts.Length != 6)
            {
                Trace.TraceError("Unexpected input to the post cleanup queue: {0}", msg.AsString);
                return false;
            }

            try
            {
                // interpret the string
                var postid = parts[0];
                var owner = parts[1];
                var url = parts[2];
                var rawTags = parts[3];
                var content = parts[4];

                // the postRow is already deleted by the frontend to remove from view
                // now we need to clean the binaries and the tag information
                var repository = new PostRepository();

                //repository.UpdateAlbumData(owner, albumId, thumbnailUrl);

                // this cleans up the tag to post relationship.  we will intentionally not
                // remove the tag however in here since it doesn't matter
                var tags = rawTags.Split(';')
                    .Where(s => s.Trim().Length > 0)
                    .Select(s => new Tag() { Name = s.Trim().ToLowerInvariant() })
                    .ToArray();

                repository.RemoveTags(postid, tags);

                // next, let's remove the blobs from storage
                var filename = Path.GetFileName(url);
                var thumbname = Path.Combine("thumb", filename);

                if (!string.IsNullOrEmpty(filename))
                {
                    Trace.TraceWarning("Attempting to delete {0}", filename);

                    var client = this.storageAccount.CreateCloudBlobClient();
                    var container = client.GetContainerReference(owner);

                    var blobGone = container.GetBlobReference(filename).DeleteIfExists();
                    var thumbGone = container.GetBlobReference(thumbname).DeleteIfExists();

                    if (!blobGone || !thumbGone)
                    {
                        Trace.TraceWarning(string.Format(CultureInfo.InvariantCulture, "Failed to {0}", blobGone ? "Kill Thumb" : thumbGone ? "Kill both" : "Kill blob"));
                    }
                }
            }
            catch (Exception ex)
            {
                Trace.TraceError("Cleanup Post Failure");
                Trace.TraceError(ex.ToString());
                return false;
            }

            return true;
        }

        private bool CreatePost(CloudQueueMessage msg)
        {
            Trace.TraceInformation("Create post called with {0}", msg.AsString);
            var parts = msg.AsString.Split('|');

            if (parts.Length != 5)
            {
                Trace.TraceError("Unexpected input to the post cleanup queue: {0}", msg.AsString);
                return false;
            }

            // interpret the string
            var owner = parts[0];
            var postid = parts[1];
            var source = parts[2];
            var content = parts[3];
            var rawContent = parts[4];

            var repository = new PostRepository();
            var post = repository.GetPostByOwner(owner, postid);

            if (post != null)
            {
                // Process the posts, download and resize images
                try
                {
                    this.ProcessPost(owner, ref content, ref rawContent);
                }
                catch (Exception ex)
                {
                    // creating the thumbnail failed for some reason
                    Trace.TraceError("Process Post failed for {0} and {1}", owner, postid);
                    Trace.TraceError(ex.ToString());

                    return false; // bail out
                }

                // update the post entity with thumb and blob location
                post.Content = content;
                post.RawContent = rawContent;

                repository.UpdatePostData(post);

                // parse the tags and save them off
                var tags = post.RawTags.Split(';')
                    .Where(s => s.Trim().Length > 0)
                    .Select(s => new Tag { Name = s.Trim().ToLowerInvariant() })
                    .ToArray();

                repository.CreateTags(postid, tags);

                // TODO, aggregate stats
                return true;
            }

            // default
            Trace.TraceError("CreateThumbnail error, cannot find {0}", postid);
            return false;
        }

        private void ProcessPost(string owner, ref string content, ref string rawContent)
        {
            var client = this.storageAccount.CreateCloudBlobClient();
            var container = client.GetContainerReference(owner);

            string file = Regex.Match(content, "<img.+?src=[\"'](.+?)[\"'].+?>", RegexOptions.IgnoreCase).Groups[1].Value;
            var fileName = file.Substring(file.LastIndexOf("/", StringComparison.OrdinalIgnoreCase) + 1);

            SaveImage(container, file);

            var blobUri = client.GetContainerReference(owner).GetBlobReference(fileName).Uri.ToString();
            var thumbUri = client.GetContainerReference(owner).GetBlobReference(Path.Combine("thumb", fileName)).Uri.ToString();

            content = content.Replace(file, thumbUri);
            rawContent = content.Replace(file, blobUri);
            
        }

        private void SaveImage(CloudBlobContainer container, string file)
        {
            using (var ms = new MemoryStream())
            {
                // add the binary to blob storage
                //var storage = this.storageAccount.CreateCloudBlobClient();
                container.CreateIfNotExist();
                container.SetPermissions(new BlobContainerPermissions { PublicAccess = BlobContainerPublicAccessType.Blob });
                // get just the file name and ignore the path
                var fileName = file.Substring(file.LastIndexOf("/", StringComparison.OrdinalIgnoreCase) + 1);
                var blob = container.GetBlobReference(fileName);

                HttpWebRequest httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(file);

                using (HttpWebResponse httpWebReponse = (HttpWebResponse)httpWebRequest.GetResponse())
                {
                    using (Stream stream = httpWebReponse.GetResponseStream())
                    {
                        blob.UploadFromStream(stream);
                        //stream.CopyTo(ms);
                    }
                }


                //blob.Properties.ContentType = mimeType;
                container.GetBlobReference(fileName).DownloadToStream(ms);

                var image = Image.FromStream(ms);

                // calculate a 290px thumbnail
                int width;
                int height;

                width = 290;
                height = 290 * image.Height / image.Width;

                // generate the thumb
                var thumb = image.GetThumbnailImage(
                    width,
                    height,
                    () => false,
                    IntPtr.Zero);

                // save it off to blob storage
                using (var thumbStream = new MemoryStream())
                {
                    thumb.Save(
                        thumbStream,
                        System.Drawing.Imaging.ImageFormat.Jpeg);

                    thumbStream.Position = 0; // reset;

                    var thumbBlob = container.GetBlobReference(Path.Combine("thumb", fileName));
                    thumbBlob.Properties.ContentType = "image/jpeg";
                    thumbBlob.UploadFromStream(thumbStream);
                }

                Trace.TraceInformation("Thumbs for {0} created", file);
            }
        }
    }
}
