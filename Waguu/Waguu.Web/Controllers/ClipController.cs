/**
 * copyright @ waguu.com 2013 
 */

namespace Waguu.Web.Controllers
{
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using System.Web.Http.ModelBinding;
    using Waguu.Data;
    using Waguu.Data.Exceptions;

    public class ClipController : ApiController
    {
        private readonly IPostRepository postRepository;

        public ClipController(IPostRepository repository)
        {
            this.postRepository = repository;
        }

        [HttpPost]
        public HttpResponseMessage Post([ModelBinder] Post data)
        {
            try
            {
                // save this data to repository
                this.postRepository.Add(data);
            }
            catch (PostNameAlreadyInUseException)
            {
                ModelState.AddModelError("Title", "A post with the same name already exists on this album");
                //var albums = this.repository.GetAlbumsByOwner(User.Identity.Name.ToLowerInvariant());
            }

            return this.Request.CreateResponse(HttpStatusCode.OK);
        }
    }
}
