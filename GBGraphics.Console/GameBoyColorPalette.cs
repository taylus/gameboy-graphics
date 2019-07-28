using System;
using System.Collections.Generic;
using System.Linq;
using SixLabors.ImageSharp.PixelFormats;

namespace GBGraphics
{
    public class GameBoyColorPalette
    {
        public IEnumerable<string> HexColors { get; set; }
        public IEnumerable<Rgba32> ToRgba32() => HexColors.Select(c => Rgba32.FromHex(c));

        private GameBoyColorPalette(params string[] hexColors)
        {
            if (hexColors == null) throw new ArgumentNullException(nameof(hexColors));
            if (hexColors.Length != 4) throw new ArgumentException("Game Boy color palettes must be 4 colors.", nameof(hexColors));
            HexColors = hexColors;
        }

        /// <summary>
        /// The original Game Boy (aka DMG for "Dot Matrix Game") greenscale color palette.
        /// </summary>
        public static GameBoyColorPalette Dmg => new GameBoyColorPalette("e0f8d0", "88c070", "346856", "081820");

        /// <summary>
        /// The Game Boy Pocket grayscale color palette.
        /// </summary>
        public static GameBoyColorPalette Pocket = new GameBoyColorPalette("e8e8e8", "a0a0a0", "585858", "101010");

        //TODO: alternative color palettes the Game Boy Color sometimes used
        //https://en.wikipedia.org/wiki/Game_Boy_Color#Color_palettes_used_for_original_Game_Boy_games
    }
}
