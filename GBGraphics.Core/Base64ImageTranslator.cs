using System;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics.Core
{
    /// <summary>
    /// Converts base64 encoded strings into ImageSharp image objects and back.
    /// </summary>
    public class Base64ImageTranslator
    {
        public Image<Rgba32> FromBase64String(string base64ImageData)
        {
            var imageBytes = Convert.FromBase64String(base64ImageData);
            return Image.Load(imageBytes);
        }

        public string ToBase64String(Image<Rgba32> image)
        {
            using (var stream = new MemoryStream())
            {
                image.SaveAsPng(stream);
                var bytes = stream.ToArray();
                return Convert.ToBase64String(bytes);
            }
        }
    }
}