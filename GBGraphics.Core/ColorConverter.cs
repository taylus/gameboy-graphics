﻿using System;
using System.Collections.Generic;
using System.IO;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics.Core
{
    /// <summary>
    /// Creates an image from a source image using the closest colors in the specified palette.
    /// </summary>
    public class ColorConverter
    {
        public Func<Rgba32, IEnumerable<Rgba32>, Rgba32> ColorMappingFunction { get; }

        public ColorConverter() : this(ColorMath.GetClosestColor) { }

        public ColorConverter(Func<Rgba32, IEnumerable<Rgba32>, Rgba32> colorMappingFunction)
        {
            ColorMappingFunction = colorMappingFunction;
        }

        public Image<Rgba32> Convert(Image<Rgba32> sourceImage, IEnumerable<Rgba32> palette)
        {
            var convertedImage = new Image<Rgba32>(sourceImage.Width, sourceImage.Height);
            var cachedColors = new Dictionary<Rgba32, Rgba32>();
            for (int y = 0; y < sourceImage.Height; y++)
            {
                for (int x = 0; x < sourceImage.Width; x++)
                {
                    var sourcePixel = sourceImage[x, y];
                    if (!cachedColors.ContainsKey(sourcePixel))
                    {
                        cachedColors[sourcePixel] = ColorMappingFunction(sourcePixel, palette);
                    }
                    convertedImage[x, y] = cachedColors[sourcePixel];
                }
            }
            return convertedImage;
        }

        public byte[] ToBytes(Image<Rgba32> image)
        {
            using var stream = new MemoryStream();
            image.SaveAsPng(stream);
            return stream.ToArray();
        }
    }
}
