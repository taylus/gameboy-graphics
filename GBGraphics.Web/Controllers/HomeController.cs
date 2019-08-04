using System;
using GBGraphics.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ColorConverter converter;

        public HomeController(ColorConverter converter)
        {
            this.converter = converter;
        }

        [HttpGet("/")]
        public IActionResult Index()
        {
            return View();
        }

        //https://docs.microsoft.com/en-us/aspnet/core/mvc/models/file-uploads?view=aspnetcore-2.2#uploading-small-files-with-model-binding
        [HttpPost("/")]
        public IActionResult ProcessImage([FromForm] IFormFile img)
        {
            if (img == null) throw new ArgumentNullException(nameof(img));
            var palette = new[] { Rgba32.FromHex("e0f8d0"), Rgba32.FromHex("88c070"), Rgba32.FromHex("346856"), Rgba32.FromHex("081820") };  //TODO: take palette as input
            using var outputStream = converter.Convert(img.OpenReadStream(), palette);
            return File(outputStream.ToArray(), "image/png");
        }
    }
}