<<<<<<< HEAD
﻿/**
 * copyright @ waguu.com 2013 
 */
=======
﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Waguu.Web.Models;
using Waguu.Data;
using Waguu.Data.WindowsAzure;
>>>>>>> 455442cd3ddabad9c46530550626179a3966a59c

namespace Waguu.Web.Controllers
{
    using System.Collections.Generic;
    using System.Web.Http;
    using Waguu.Web.Models;

    public class DocumentController : ApiController
    {
<<<<<<< HEAD
        [HttpGet]
        public IEnumerable<Document> More(int pageNo, int pagesize = 20)
=======
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
>>>>>>> 455442cd3ddabad9c46530550626179a3966a59c
        {
            //return DocumentRepository.GetData(pageNo, pageSize);
            return DocumentRepository.GetData(pageNo, pagesize);
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
