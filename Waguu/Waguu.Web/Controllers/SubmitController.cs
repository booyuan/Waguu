using System;
using System.Web.Http;
using Waguu.Data;
using Waguu.Data.Exceptions;
using Waguu.Data.WindowsAzure;

namespace Waguu.Web.Controllers
{
    public class SubmitController : ApiController
    {
        private IPostRepository repository;

        public SubmitController()
            : this(new PostRepository())
        {
        }

        public SubmitController(IPostRepository repository)
        {
            this.repository = repository;
        }

        public void CreatePost()
        {
            string albumName = String.Empty;
            string description = "test data 5";
            string owner = "yyy";
            string id = string.Format("{0:D19}", DateTime.MaxValue.Ticks - DateTime.UtcNow.Ticks);;
            string source = "http://giphy.com/gifs/RwnoM2uvfwqcw/";
            string title = "Delicious recipes";
            string content = "Delicious recipes. <img src=\"http://images4.fanpop.com/image/photos/23400000/Food-delicious-recipes-23444870-1600-1200.jpg\"/> go go. Another one <img src=\"http://upload.wikimedia.org/wikipedia/commons/6/62/Korean_food-Bibim_ssambap_and_various_banchan-01.jpg\"/>";
            string rawContent = content;
            string tags = "food;recipes";

            try
            {
                this.repository.Add(
                                    new Post()
                                    {
                                        AlbumId = albumName,
                                        Description = description,
                                        Owner = owner,
                                        PostId = id,
                                        Source = source,
                                        Title = title,
                                        Content = content,//"/Content/images/processing.png",
                                        RawContent = rawContent,//"/Content/images/processing.png",
                                        RawTags = string.IsNullOrEmpty(tags) ? owner : owner + ";" + tags
                                    }
                                    );
            }
            catch (PostNameAlreadyInUseException)
            {
                ModelState.AddModelError("Title", "A post with the same name already exists on this album");
                //var albums = this.repository.GetAlbumsByOwner(User.Identity.Name.ToLowerInvariant());
            }
        }
    }
}
