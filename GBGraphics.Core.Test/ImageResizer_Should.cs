using FluentAssertions;
using SixLabors.ImageSharp;
using SixLabors.Primitives;
using Xunit;

namespace GBGraphics.Core.Test
{
    public class ImageResizer_Should
    {
        [Fact]
        public void Resize_Images()
        {
            var resizer = new ImageResizer();
            using var sourceImage = TestData.CreateTestImage();

            const int width = 64;
            const int height = 64;
            resizer.Resize(sourceImage, width, height);

            sourceImage.Size().Should().Be(new Size(width, height));
        }
    }
}
