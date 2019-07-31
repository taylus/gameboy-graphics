using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Processors.Transforms;
using SixLabors.Primitives;

namespace GBGraphics
{
    /// <summary>
    /// Resizes a source image using the given sampler.
    /// </summary>
    public class ImageResizer
    {
        public Image<Rgba32> SourceImage { get; }
        public IResampler Sampler { get; }

        public ImageResizer(Image<Rgba32> sourceImage, IResampler sampler)
        {
            SourceImage = sourceImage;
            Sampler = sampler;
        }

        public ImageResizer(Image<Rgba32> sourceImage) : this(sourceImage, KnownResamplers.Bicubic)
        {

        }

        public Image<Rgba32> Resize(int width, int height)
        {
            if (SourceImage.Width != width && SourceImage.Height != height)
            {
                SourceImage.Mutate(ctx => ctx.Resize(new ResizeOptions()
                {
                    Mode = ResizeMode.Stretch,
                    Sampler = Sampler,
                    Size = new Size(width, height)
                }));
            }
            return SourceImage;
        }
    }
}
