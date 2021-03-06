﻿using System;
using System.Collections.Generic;
using System.Linq;
using GBGraphics.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ColorConverter converter;
        private readonly ImageResizer resizer;
        private readonly FileUploadOptions fileOptions;

        public HomeController(ColorConverter converter, ImageResizer resizer, FileUploadOptions fileOptions)
        {
            this.converter = converter;
            this.resizer = resizer;
            this.fileOptions = fileOptions;
        }

        [HttpGet("/")]
        public IActionResult Index()
        {
            return View();
        }

        //https://docs.microsoft.com/en-us/aspnet/core/mvc/models/file-uploads?view=aspnetcore-2.2#uploading-small-files-with-model-binding
        [HttpPost("/")]
        public IActionResult ProcessImage([FromForm] IFormFile img, [FromForm] IEnumerable<string> colors, [FromForm] bool resize = false)
        {
            if (img == null) throw new ArgumentNullException(nameof(img));
            if (!fileOptions.AcceptedMimeTypes.Contains(img.ContentType)) throw new ArgumentException(
                $"File is not an accepted type. Expected one of: {string.Join(", ", fileOptions.AcceptedMimeTypes)} but received: {img.ContentType}.");
            if (colors == null) throw new ArgumentNullException(nameof(colors));
            if (colors.Count() < 2) throw new ArgumentException("Color palette must be at least two colors.", nameof(colors));

            var palette = colors.Select(c => Rgba32.FromHex(c));

            using var sourceImage = Image.Load(img.OpenReadStream());
            if (resize || img.Length > fileOptions.MaxSizeInBytesBeforeResizing)
            {
                resizer.Resize(sourceImage, GameBoyConstants.ScreenWidth, GameBoyConstants.ScreenHeight);
            }
            using var outputImage = converter.Convert(sourceImage, palette);
            return File(converter.ToBytes(outputImage), "image/png");
        }
    }
}