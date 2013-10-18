namespace Waguu.Data.WindowsAzure
{
    using System;
    using System.Globalization;
    using Microsoft.WindowsAzure.StorageClient;

    public class PostTagRow : TableServiceEntity
    {
        public PostTagRow()
            : base()
        {
        }

        public PostTagRow(string postId, string tag) : 
            base(tag, string.Format(CultureInfo.InvariantCulture, "{0}_{1}", tag, postId))
        {
            this.PostId = postId;
            this.Tag = tag;
        }

        public string PostId { get; set; }

        public string Tag { get; set; }
    }
}
