using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Waguu.Data;
using Waguu.Data.Exceptions;
using Waguu.Data.WindowsAzure;
//using Waguu.Web.ViewModels;

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
            string description = "test data 1";
            string owner = "boyuan";
            string id = DateTime.Now.Ticks.ToString();
            string source = "http://www.telegraph.co.uk/travel/travel-advice/9305570/What-should-I-see-and-do-in-Nice.html";
            string title = "What should I see and do in Nice?";
            string content = "Nice in June is an excellent idea. The weather should be just right. As a first step to planning your break, perhaps you would like to have a look at my guide to Nice. <img src=\"http://i.telegraph.co.uk/multimedia/archive/02236/advice-nice_2236594b.jpg\"/> You will find there details of my favourite hotels, restaurants and attractions, as well as suggestions for driving itineraries.";
            string rawContent = content;
            string tags = String.Empty;

            try
            {
                this.repository.Add(
                                    new Post()
                                    {
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
