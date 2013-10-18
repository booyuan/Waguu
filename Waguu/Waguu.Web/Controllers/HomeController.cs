
namespace Waguu.Web.Controllers
{
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
    }
}
