using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics.Core.Test
{
    internal static class TestData
    {
        public static Image<Rgba32> CreateTestImage() => Image.LoadPixelData(new[] { Rgba32.Red, Rgba32.Green, Rgba32.Blue, Rgba32.Yellow }, 2, 2);
    }
}
