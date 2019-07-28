using System;
using System.Collections.Generic;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics
{
    /// <summary>
    /// Creates an image from a source image using the closest colors in the specified palette.
    /// </summary>
    public class ColorConverter
    {
        public Image<Rgba32> SourceImage { get; }
        public IEnumerable<Rgba32> Palette { get; }
        public Func<Rgba32, IEnumerable<Rgba32>, Rgba32> ColorMappingFunction { get; }

        public ColorConverter(Image<Rgba32> sourceImage, IEnumerable<Rgba32> palette, Func<Rgba32, IEnumerable<Rgba32>, Rgba32> colorMappingFunction)
        {
            SourceImage = sourceImage;
            Palette = palette;
            ColorMappingFunction = colorMappingFunction;
        }

        public Image<Rgba32> Convert()
        {
            var convertedImage = new Image<Rgba32>(SourceImage.Width, SourceImage.Height);
            for (int y = 0; y < SourceImage.Height; y++)
            {
                for (int x = 0; x < SourceImage.Width; x++)
                {
                    var sourcePixel = SourceImage[x, y];
                    convertedImage[x, y] = ColorMappingFunction(sourcePixel, Palette);
                }
            }
            return convertedImage;
        }
    }
}
