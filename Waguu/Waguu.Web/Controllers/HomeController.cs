
namespace Waguu.Web.Controllers
{
    using System.Net;
    using System.IO;
    using System.Text;
    using System.Web.Mvc;
    using Services.Test;

    public class HomeController : Controller
    {
        private SomethingUseTest somethingUseTest;
        public HomeController(SomethingUseTest somethingUseTest)
        {
            this.somethingUseTest = somethingUseTest;
        }

        public ActionResult Index()
        {
            PostForm();
            ViewBag.Message = "Showing test name: " + this.somethingUseTest.TestName;

            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
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
