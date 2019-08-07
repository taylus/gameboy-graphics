using System;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics.Blazor
{
    /// <summary>
    /// Converts base64 encoded strings into ImageSharp image objects and back.
    /// </summary>
    public class Base64ImageTranslator
    {
        public Image<Rgba32> FromBase64String(string base64ImageData)
        {
            if (base64ImageData.StartsWith("data:")) base64ImageData = base64ImageData.Split(',')[1];
            var imageBytes = Convert.FromBase64String(base64ImageData);
            return Image.Load(imageBytes);
        }

        public string ToBase64String(Image<Rgba32> image)
        {
            return image.ToBase64String(PngFormat.Instance);
        }
    }
}