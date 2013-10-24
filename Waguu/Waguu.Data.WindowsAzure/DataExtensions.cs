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
                AlbumId = row.AlbumId,
                Owner = row.Owner,
                Content = row.Content,
                Title = row.Title,
                RawContent = row.RawContent,
                Description = row.Description,
                RawTags = row.RawTags
            };
        }

        public static IEnumerable<Album> ToModel(this IEnumerable<AlbumRow> rows)
        {
            foreach (var row in rows)
            {
                yield return row.ToModel();
            }
        }

        public static Album ToModel(this AlbumRow row)
        {
            return new Album()
            {
                AlbumId = row.AlbumId,
                Title = row.Title,
                Owner = row.Owner,
                Description = row.Description,
                HasPosts = row.HasPosts
            };
        }
    }
}
