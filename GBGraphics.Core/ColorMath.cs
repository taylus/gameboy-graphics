using System;
using System.Collections.Generic;
using System.Linq;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics.Core
{
    public static class ColorMath
    {
        /// <summary>
        /// Returns the distance squared between the given colors in color space.
        /// </summary>
        /// <see cref="https://en.wikipedia.org/wiki/Color_difference#Euclidean"/>
        public static float EuclideanSquared(Rgba32 c1, Rgba32 c2)
        {
            float deltaR = c2.R - c1.R;
            float deltaG = c2.G - c1.G;
            float deltaB = c2.B - c1.B;
            return (deltaR * deltaR) + (deltaG * deltaG) + (deltaB * deltaB);
        }

        /// <summary>
        /// Returns the color in the given palette "closest" to the source color
        /// by minimizing the distance calculated by <see cref="EuclideanSquared"/>.
        /// </summary>
        public static Rgba32 GetClosestColor(Rgba32 sourceColor, IEnumerable<Rgba32> palette)
        {
            return GetClosestColor(sourceColor, palette, EuclideanSquared);
        }

        /// <summary>
        /// Returns the color in the given palette "closest" to the source color
        /// by minimizing the distance calculated by the given function.
        /// </summary>
        public static Rgba32 GetClosestColor(Rgba32 sourceColor, IEnumerable<Rgba32> palette, Func<Rgba32, Rgba32, float> distanceFunc)
        {
            var distances = palette.Distinct().ToDictionary(p => p, p => distanceFunc(sourceColor, p));
            return distances.OrderBy(kvp => kvp.Value).First().Key;
        }
    }
}
