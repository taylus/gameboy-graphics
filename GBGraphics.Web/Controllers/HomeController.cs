using GBGraphics.Core;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics.Web.Controllers
{
    public class HomeController : Controller
    {
        private Base64ImageTranslator translator;
        private ColorConverter converter;

        public HomeController(Base64ImageTranslator translator, ColorConverter converter)
        {
            this.translator = translator;
            this.converter = converter;
        }

        [HttpGet("/")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost("/")]
        public IActionResult ProcessImage([FromBody] string base64ImageData)
        {
            //TODO: take palette as input
            var palette = new[] { Rgba32.FromHex("e0f8d0"), Rgba32.FromHex("88c070"), Rgba32.FromHex("346856"), Rgba32.FromHex("081820") };
            var sourceImage = translator.FromBase64String(base64ImageData);
            var convertedImage = converter.Convert(sourceImage, palette);
            return Content(translator.ToBase64String(convertedImage));
        }
    }
}