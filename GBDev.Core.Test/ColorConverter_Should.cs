using System;
using System.Collections.Generic;
using FluentAssertions;
using GBGraphics.Core;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using Xunit;

namespace GBDev.Core.Test
{
    public class ColorConverter_Should
    {
        [Fact]
        public void Convert_Image_Colors_Per_Color_Mapping_Function()
        {
            var palette = new[] { Rgba32.Black, Rgba32.White };
            Func<Rgba32, IEnumerable<Rgba32>, Rgba32> colorMappingFunction = ColorMath.GetClosestColor;
            var converter = new ColorConverter(colorMappingFunction);

            using var sourceImage = CreateTestImage();
            var convertedImage = converter.Convert(sourceImage, palette);
            convertedImage.Size().Should().Be(sourceImage.Size());
            for (int x = 0; x < convertedImage.Width; x++)
            {
                for (int y = 0; y < convertedImage.Height; y++)
                {
                    var expectedColor = colorMappingFunction(sourceImage[x, y], palette);
                    convertedImage[x, y].Should().Be(expectedColor);
                }
            }
        }

        [Fact]
        public void Get_Bytes_For_Image()
        {
            var converter = new ColorConverter();
            using var sourceImage = CreateTestImage();

            var bytes = converter.ToBytes(sourceImage);
            using var destImage = Image.Load(bytes);

            AssertImagesAreSame(sourceImage, destImage);
        }

        private static void AssertImagesAreSame(Image<Rgba32> expected, Image<Rgba32> actual)
        {
            actual.Size().Should().Be(expected.Size());
            for (int x = 0; x < expected.Width; x++)
            {
                for (int y = 0; y < expected.Height; y++)
                {
                    actual[x, y].Should().Be(expected[x, y]);
                }
            }
        }

        private static Image<Rgba32> CreateTestImage() => Image.LoadPixelData(new[] { Rgba32.Red, Rgba32.Green, Rgba32.Blue, Rgba32.Yellow }, 2, 2);
    }
}
