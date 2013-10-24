namespace Waguu.Data
{
    using System.Collections.Generic;

    public interface IPostRepository
    {
        IEnumerable<Post> GetAllPosts();

        Post GetPostByOwner(string owner, string postId);

        void Add(Post post);
        
        void Delete(string owner, string postId);
        
        void UpdatePostData(Post post);
        
        void CreateTags(string postId, Tag[] tags);
        
        void RemoveTags(string postId, Tag[] tags);

        IEnumerable<Post> FindPostsByTag(params string[] tags);

        void BootstrapUser(string userName);
    }
}
