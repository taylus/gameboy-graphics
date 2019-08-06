using Microsoft.AspNetCore.Http;
using SixLabors.ImageSharp.PixelFormats;
using System.Collections.Generic;
using System.Linq;

namespace GBGraphics.AzureFunctions
{
    internal class ProcessImageRequest
    {
        private static readonly string[] acceptedMimeTypes = new string[] { "image/jpeg", "image/png", "image/gif", "image/bmp" };

        public IFormFile Image { get; set; }
        public IEnumerable<string> Colors { get; set; }
        public IEnumerable<Rgba32> Palette => Colors.Select(c => Rgba32.FromHex(c));
        public bool Resize { get; set; }

        private ProcessImageRequest(IFormCollection formData)
        {
            Image = formData.Files["img"];
            Colors = formData["colors"];
            bool.TryParse(formData["resize"], out bool resize);
            Resize = resize;
        }

        public static ProcessImageRequest ParseFrom(IFormCollection formData)
        {
            return new ProcessImageRequest(formData);
        }

        public IEnumerable<string> Validate()
        {
            var errors = new List<string>();
            if (Image == null) errors.Add($"Request.{nameof(Image)} cannot be null.");
            if (Image != null && !acceptedMimeTypes.Contains(Image.ContentType)) errors.Add(
                $"File is not an accepted type. Expected one of: {string.Join(", ", acceptedMimeTypes)} but received: {Image.ContentType}.");
            if (Colors == null || Colors.Count() == 0) errors.Add($"Request.{nameof(Colors)} cannot be null.");
            if (Colors != null && Colors.Count() < 2) errors.Add("Color palette must be at least two colors.");
            return errors;
        }

        public override string ToString()
        {
            return $"Image: {{{ImageDebugToString()}}}, Colors: [{string.Join(", ", Colors)}], Resize: {Resize}";
        }

        private string ImageDebugToString()
        {
            if (Image == null) return "null";
            return $"{Image.FileName}, {Image.Length} bytes, {Image.ContentType}";
        }
    }
}
