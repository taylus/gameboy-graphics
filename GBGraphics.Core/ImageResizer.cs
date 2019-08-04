using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.Processing.Processors.Transforms;
using SixLabors.Primitives;

namespace GBGraphics.Core
{
    /// <summary>
    /// Resizes a source image using the given sampler.
    /// </summary>
    public class ImageResizer
    {
        public IResampler Sampler { get; }

        public ImageResizer(IResampler sampler)
        {
            Sampler = sampler;
        }

        public ImageResizer() : this(KnownResamplers.Bicubic)
        {

        }

        public void Resize(Image<Rgba32> image, int width, int height)
        {
            if (image.Width != width && image.Height != height)
            {
                image.Mutate(ctx => ctx.Resize(new ResizeOptions()
                {
                    Mode = ResizeMode.Stretch,
                    Sampler = Sampler,
                    Size = new Size(width, height)
                }));
            }
        }
    }
}
