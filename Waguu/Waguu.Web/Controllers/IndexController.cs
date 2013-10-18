using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Waguu.Web.Models;
using Waguu.Data;
using Waguu.Data.WindowsAzure;

using System.Net;
using System.IO;
using System.Text;

namespace Waguu.Web.Controllers
{
    public class IndexController : Controller
    {
        private IPostRepository repository;

        public IndexController()
            : this(new PostRepository())
        {
        }

        public IndexController(IPostRepository repository)
        {
            this.repository = repository;
        }

        public ActionResult Index(string parameter)
        {
            //PostForm();
            IEnumerable<Post> posts;
            if (parameter == null)
            {
                posts = this.repository.GetAllPosts();
            }
            else
            {
                List<string> l = new List<string>() { parameter };
                posts = this.repository.FindPostsByTag(l.ToArray());
            }
            return View(posts);
            //return View(DocumentRepository.GetData(1, 20));
        }

        private void PostForm()
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://localhost:22128/api/Submit/CreatePost");
            request.Method = "POST";
            request.ContentType = "application/x-www-form-urlencoded";
            string postData = "home=Cosby&favorite+flavor=flies";
            byte[] bytes = Encoding.UTF8.GetBytes(postData);
            request.ContentLength = bytes.Length;

            Stream requestStream = request.GetRequestStream();
            requestStream.Write(bytes, 0, bytes.Length);

            WebResponse response = request.GetResponse();
            Stream stream = response.GetResponseStream();
            StreamReader reader = new StreamReader(stream);

            var result = reader.ReadToEnd();
            stream.Dispose();
            reader.Dispose();
        }

    }
}
