using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using GBGraphics.Core;
using SixLabors.ImageSharp;

namespace GBGraphics
{
    public class Program
    {
        /// <summary>
        /// Creates an image from a source image using the closest colors in the Game Boy palette.
        /// </summary>
        public static void Main(string[] args)
        {
            ParseCommandLineArgs(args, out string convertedImagePath, out string sourceImagePath, out bool resize);
            if (sourceImagePath == null || convertedImagePath == null) return;

            if (!File.Exists(sourceImagePath))
            {
                Console.Error.WriteLine($"Input image \"{sourceImagePath}\" does not exist.");
                Environment.Exit(-1);
            }

            using (var sourceImage = Image.Load(sourceImagePath))
            {
                if (resize)
                {
                    var resizer = new ImageResizer();
                    resizer.Resize(sourceImage, GameBoyConstants.ScreenWidth, GameBoyConstants.ScreenHeight);
                }

                var palette = GameBoyColorPalette.Dmg.ToRgba32();
                var converter = new ColorConverter();
                var convertedImage = converter.Convert(sourceImage, palette);

                convertedImage.Save(convertedImagePath);
            }

            Process.Start(new ProcessStartInfo() { FileName = convertedImagePath, UseShellExecute = true });
        }

        private static void ParseCommandLineArgs(string[] args, out string outFile, out string inFile, out bool resize)
        {
            resize = args.Contains("-r");
            if (resize) args = args.Where(a => a != "-r").ToArray();

            if (args.Length == 1)
            {
                inFile = args[0];
                outFile = "output.png";
            }
            else if (args.Length == 3 && args[0] == "-o")
            {
                outFile = args[1];
                inFile = args[2];
            }
            else
            {
                outFile = inFile = null;
                Console.WriteLine("Usage: gbgfx [-o output.png] input.png");
            }
        }
    }
}
