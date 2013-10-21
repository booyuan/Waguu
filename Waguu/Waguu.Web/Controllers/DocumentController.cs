using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Waguu.Web.Models;
using Waguu.Data;
using Waguu.Data.WindowsAzure;

namespace Waguu.Web.Controllers
{
    public class DocumentController : ApiController
    {
        private IPostRepository repository;

        public DocumentController()
            : this(new PostRepository())
        {
        }

        public DocumentController(IPostRepository repository)
        {
            this.repository = repository;
        }

        public IEnumerable<Document> PostMoreDocuments()
        {
            //return DocumentRepository.GetData(pageNo, pageSize);
            return DocumentRepository.GetData(1, 20);
        }

        public IEnumerable<Post> MorePosts(int pageIndex, int pageSize, string parameter)
        {
            IEnumerable<Post> posts;
            if (String.IsNullOrEmpty(parameter))
            {
                posts = this.repository.GetAllPosts();
            }
            else
            {
                List<string> l = new List<string>() { parameter };
                posts = this.repository.FindPostsByTag(l.ToArray());
            }
            return posts;
        }
    }
}
