/**
 * copyright @ waguu.com 2013 
 */

namespace Waguu.Web.Controllers
{
    using System.Collections.Generic;
    using System.Web.Http;
    using Waguu.Web.Models;

    public class DocumentController : ApiController
    {
        [HttpGet]
        public IEnumerable<Document> More(int pageNo, int pagesize = 20)
        {
            //return DocumentRepository.GetData(pageNo, pageSize);
            return DocumentRepository.GetData(pageNo, pagesize);
        }
    }
}
