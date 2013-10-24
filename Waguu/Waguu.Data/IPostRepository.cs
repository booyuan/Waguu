namespace Waguu.Data
{
    using System.Collections.Generic;

    public interface IPostRepository
    {
        IEnumerable<Post> GetAllPosts();

        IEnumerable<Post> GetPostsByAlbum(string owner, string albumId);

        Post GetPostByOwner(string owner, string albumId, string postId);

        void Add(Post post);
        
        void Delete(string owner, string album, string postId);
        
        void UpdatePostData(Post post);
        
        void CreateTags(string postId, Tag[] tags);
        
        void RemoveTags(string postId, Tag[] tags);

        IEnumerable<Album> GetAlbums();
        
        IEnumerable<Album> GetAlbumsByOwner(string owner);

        void CreateAlbum(string albumName, string owner);
        
        void DeleteAlbum(string albumName, string owner);
        
        void UpdateAlbum(Album album);

        IEnumerable<Post> FindPostsByTag(params string[] tags);

        void BootstrapUser(string userName, string albumName);
    }
}
