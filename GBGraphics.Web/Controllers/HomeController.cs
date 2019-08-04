using System;
using System.Collections.Generic;
using System.Linq;
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
        public IActionResult ProcessImage([FromForm] IFormFile img, [FromForm] IEnumerable<string> colors)
        {
            if (img == null) throw new ArgumentNullException(nameof(img));
            if (colors == null) throw new ArgumentNullException(nameof(colors));
            if (colors.Count() < 2) throw new ArgumentException("Color palette must be at least two colors.", nameof(colors));

            var palette = colors.Select(c => Rgba32.FromHex(c));
            using var outputStream = converter.Convert(img.OpenReadStream(), palette);
            return File(outputStream.ToArray(), "image/png");
        }
    }
}