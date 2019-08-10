/* jshint esversion: 6, browser: true, devel: true */
/* globals exif */
(function (options) {
    "use strict";
    var screen, context, latestFile;
    document.addEventListener("DOMContentLoaded", function () {
        screen = document.getElementById("screen");
        context = screen.getContext("2d");
        (function registerHandlers() {
            //colorize the image when the input file changes
            var input = document.querySelector("input[type=file]");
            input.addEventListener("change", () => handleFile(input.files[0]));

            //or when the palette changes while an input file is selected
            document.querySelectorAll("input[type=radio]").forEach((radio) => {
                radio.addEventListener("change", () => handleFile(latestFile));
            });

            //or when the resize checkbox changes while an input file is selected
            document.getElementById("resize").addEventListener("change", () => handleFile(latestFile));

            //activate the file input by clicking/tapping on the Game Boy
            var gb = document.getElementById("gameboy");
            gb.addEventListener("click", () => input.click());

            //fill color palette labels with their (hidden) color input's color
            //since <input type="color"> looks gross and is largely unstylable
            //https://stackoverflow.com/a/26086382/7512368
            document.querySelectorAll("label.color-swatch").forEach((label) => {
                var color = label.querySelector("input[type=color]").value;
                label.style.backgroundColor = color;
            });

            document.querySelectorAll("input[type=color]").forEach((input) => {
                //update the label's background color when a color input changes
                input.addEventListener("change", function () {
                    this.parentNode.style.backgroundColor = this.value;
                    handleFile(latestFile);
                });

                //select the "use custom colors" radio button when a color input is clicked
                input.addEventListener("click", () => {
                    document.getElementById("custom").checked = true;
                    handleFile(latestFile);
                });
            });

            //load image via click and drag onto the Game Boy
            var gameboy = document.getElementById("gameboy");
            gameboy.addEventListener("drop", (event) => {
                handleFile(event.dataTransfer.files[0]);
            });

            //stop the browser's default behavior of displaying the file when dragged in
            ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
                gameboy.addEventListener(eventName, (event) => event.preventDefault());
            });

            //visual effects for file click and drag
            ["dragenter", "dragover"].forEach(eventName => {
                gameboy.addEventListener(eventName, () => gameboy.parentNode.classList.add("filedrop"));
            });

            ["dragleave", "drop"].forEach(eventName => {
                gameboy.addEventListener(eventName, () => gameboy.parentNode.classList.remove("filedrop"));
            });
        })();
    });

    function handleFile(file) {
        if (!file) return;

        if (!file.type.match('image.*')) {
            alert("Please select an image file.");
            return;
        }

        var resizeCheckbox = document.getElementById("resize");
        var resize = resizeCheckbox.checked;
        if (file.size > options.fileSizeBeforeResizing) {
            resize = true;
            resizeCheckbox.checked = resize;
        }

        latestFile = file;

        var palette = getSelectedColors().map((color) => hexToRgb(color));

        options.exif.getOrientation(file, (orientation) => {
            var image = new Image();
            var reader = new FileReader();
            reader.addEventListener("load", function (event) {
                if (event.target.readyState == FileReader.DONE) {
                    image.src = event.target.result;
                    image.addEventListener("load", function () {
                        var colorized = colorize(image, palette, resize, orientation);
                        options.exif.configureCanvas(screen, colorized, orientation);
                        options.exif.configureContext(context, colorized, orientation);
                        context.drawImage(colorized, 0, 0);
                        screen.style.display = "inline";
                    });
                }
            });
            reader.readAsDataURL(file);
        });
    }

    function colorize(image, palette, resize) {
        //do color conversion on an in-memory canvas
        //since get/putImageData are unaffected by a rotation transform
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");

        if (resize) {
            canvas.width = options.screenWidth;
            canvas.height = options.screenHeight;
        }
        else {
            canvas.width = image.width;
            canvas.height = image.height;
        }

        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        for (var i = 0; i < data.length; i += 4) {
            var color = {
                r: data[i],
                g: data[i + 1],
                b: data[i + 2],
                a: data[i + 3]
            };
            var closestColor = getClosestColor(color, palette);
            data[i] = closestColor.r;
            data[i + 1] = closestColor.g;
            data[i + 2] = closestColor.b;
            data[i + 3] = closestColor.a;
        }
        context.putImageData(imageData, 0, 0);
        return canvas;

        function getClosestColor(color, palette, colorMappingFunc) {
            colorMappingFunc = colorMappingFunc || euclideanSquared;
            var distances = palette.map(function (paletteColor) {
                return {
                    color: paletteColor,
                    distance: colorMappingFunc(color, paletteColor)
                };
            });
            distances.sort((a, b) => a.distance - b.distance);
            return distances[0].color;
        }

        function euclideanSquared(c1, c2) {
            var deltaR = c2.r - c1.r;
            var deltaG = c2.g - c1.g;
            var deltaB = c2.b - c1.b;
            return deltaR * deltaR + deltaG * deltaG + deltaB * deltaB;
        }
    }

    function getSelectedColors() {
        var selectedPalette = document.querySelector("input[name=palette]:checked").value;
        var label = document.querySelector("label[for=" + selectedPalette + "]");
        if (selectedPalette !== "custom") {
            var spans = Array.from(label.querySelectorAll("span"));
            return spans.map((div) => rgbToHex(div.style.backgroundColor));
        }
        else {
            var inputs = Array.from(label.querySelectorAll("input[type=color]"));
            return inputs.map((input) => input.value);
        }
    }

    function rgbToHex(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : "";
    }

    function hexToRgb(hex) {
        var r = parseInt(hex.slice(1, 3), 16);
        var g = parseInt(hex.slice(3, 5), 16);
        var b = parseInt(hex.slice(5, 7), 16);
        return { r: r, g: g, b: b, a: 255 };
    }
}({
    fileSizeBeforeResizing: 1024 * 1024 * 2,
    screenWidth: 160,
    screenHeight: 144,
    exif: exif
}));