namespace Waguu.Data.WindowsAzure
{
    using System.Collections.Generic;

    public static class DataExtensions
    {
        public static IEnumerable<Post> ToModel(this IEnumerable<PostRow> rows)
        {
            foreach (var row in rows)
            {
                yield return row.ToModel();
            }
        }

        public static Post ToModel(this PostRow row)
        {
            return new Post()
            {
                PostId = row.PostId,
                Owner = row.Owner,
                Content = row.Content,
                Title = row.Title,
                RawContent = row.RawContent,
                Description = row.Description,
                RawTags = row.RawTags
            };
        }
    }
}
