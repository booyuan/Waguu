﻿/**
 * copyright @ waguu.com 2013 
 */
﻿using System;
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
    using System.Collections.Generic;
    using System.Web.Http;
    using Waguu.Web.Models;

    public class DocumentController : ApiController
    {
        private IPostRepository repository;

        public DocumentController(IPostRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public IEnumerable<Document> More(int pageNo, int pageSize = 20)
        {
            //return DocumentRepository.GetData(pageNo, pageSize);
            return DocumentRepository.GetData(pageNo, pageSize);
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
