using Microsoft.AspNetCore.Mvc;

namespace GBGraphics.Web.Controllers
{
    public class HomeController : Controller
    {
        [HttpGet("/")]
        public IActionResult Index()
        {
            return View();
        }
    }
}