# gbgfx 
Convert images into the Game Boy's color palette -- written in .NET Core using [ImageSharp](https://github.com/SixLabors/ImageSharp).

![sample input](screenshots/example_input.png "sample input")
![sample output](screenshots/example_output.png "sample output")

[![Build Status](https://travis-ci.org/taylus/gameboy-graphics.svg?branch=travis-ci)](https://travis-ci.org/taylus/gameboy-graphics)
[![Coverage Status](https://coveralls.io/repos/github/taylus/gameboy-graphics/badge.svg?branch=travis-ci)](https://coveralls.io/github/taylus/gameboy-graphics?branch=travis-ci)

## Command line usage
```
gbgfx [-r] [-o output.png] input.png
```

`-r`

&nbsp;&nbsp;&nbsp;&nbsp;Resize the output image to fit the Game Boy's screen (160 x 144 pixels).

`-o outfile`

&nbsp;&nbsp;&nbsp;&nbsp;The name of the output file.

## Web application
Alternatively, run the `GBGraphics.Web` web application for a GUI:

![web app screenshot](screenshots/screenshot_webapp.png "web app screenshot")

## Displaying images on a Game Boy
See here for instructions on how to [build a ROM](building_a_rom.md) which displays images produced by `gbgfx`!

![displaying images on a Game Boy](screenshots/running_on_gbc.jpg "displaying images on a Game Boy")
