﻿/**
 * copyright @ waguu.com 2013 
 */

namespace Waguu.Web.Controllers
{
    using System;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;
    using Waguu.Data;
    using Waguu.Data.Exceptions;
    using Waguu.Data.WindowsAzure;

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

        [HttpGet]
        public HttpResponseMessage CreatePost()
        {
<<<<<<< HEAD
            string description = "test data 1";
            string owner = "boyuan";
            string id = DateTime.Now.Ticks.ToString();
            string source = "http://www.telegraph.co.uk/travel/travel-advice/9305570/What-should-I-see-and-do-in-Nice.html";
            string title = "What should I see and do in Nice?";
            string content = "Nice in June is an excellent idea. The weather should be just right. As a first step to planning your break, perhaps you would like to have a look at my guide to Nice. <img src=\"http://i.telegraph.co.uk/multimedia/archive/02236/advice-nice_2236594b.jpg\"/> You will find there details of my favourite hotels, restaurants and attractions, as well as suggestions for driving itineraries.";
=======
            string albumName = String.Empty;
            string description = "test data 5";
            string owner = "yyy";
            string id = string.Format("{0:D19}", DateTime.MaxValue.Ticks - DateTime.UtcNow.Ticks);;
            string source = "http://giphy.com/gifs/RwnoM2uvfwqcw/";
            string title = "Delicious recipes";
            string content = "Delicious recipes. <img src=\"http://images4.fanpop.com/image/photos/23400000/Food-delicious-recipes-23444870-1600-1200.jpg\"/> go go. Another one <img src=\"http://upload.wikimedia.org/wikipedia/commons/6/62/Korean_food-Bibim_ssambap_and_various_banchan-01.jpg\"/>";
>>>>>>> 455442cd3ddabad9c46530550626179a3966a59c
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

            return new HttpResponseMessage()
            {
                StatusCode = HttpStatusCode.OK
            };
        }
    }
}
