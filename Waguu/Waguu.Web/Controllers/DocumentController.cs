﻿/**
 * copyright @ waguu.com 2013 
 */
namespace Waguu.Web.Controllers
{
    using System.Collections.Generic;
    using System.Web.Http;
    ﻿using Waguu.Data;

    public class DocumentController : ApiController
    {
        private IPostRepository repository;

        public DocumentController(IPostRepository repository)
        {
            this.repository = repository;
        }

        [HttpGet]
        public IEnumerable<Post> More(int pageNo, int pageSize = 20)
        {
            return this.repository.GetAllPosts();
        }
    }
}
