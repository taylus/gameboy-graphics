/* jshint esversion: 6, browser: true, devel: true */
(function (options) {
    "use strict";
    var screen = document.getElementById("screen");
    var context = screen.getContext("2d");

    document.addEventListener("DOMContentLoaded", function () {
        //colorize the image when the input file changes
        var input = document.querySelector("input[type=file]");
        input.addEventListener("change", () => handleFile(input.files[0]));
        var latestFile = input.files[0];

        //or when the palette changes while an input file is selected
        document.querySelectorAll("input[type=radio]").forEach((radio) => {
            radio.addEventListener("change", () => handleFile(latestFile));
        });

        //or when the resize checkbox changes while an input file is selected
        document.getElementById("resize").addEventListener("change", () => handleFile(latestFile));

        //show the colorized image (to download it)
        var downloadButton = document.getElementById("download");
        downloadButton.disabled = true;
        downloadButton.addEventListener("click", () => {
            window.location = screen.toDataURL("image/png");
        });

        function handleFile(file) {
            if (!file) return;

            if (!file.type.match('image.*')) {
                alert("Please select an image file.");
                return;
            }

            if (file.size > options.fileSizeLimit) {
                alert("Please use a file smaller than " + formatSizeForDisplay(options.fileSizeLimit) + ".");
                return;
            }

            latestFile = file;

            var palette = getSelectedColors().map((color) => hexToRgb(color));
            var resize = document.getElementById("resize").checked;

            var image = new Image();
            var reader = new FileReader();
            reader.addEventListener("load", function (event) {
                if (event.target.readyState == FileReader.DONE) {
                    image.src = event.target.result;
                    image.addEventListener("load", function () {
                        colorize(image, palette, resize);
                        screen.style.display = "inline";
                        screen.scrollIntoView();
                        downloadButton.disabled = false;
                        downloadButton.focus();
                    });
                }
            });
            reader.readAsDataURL(file);

            function colorize(image, palette, resize) {
                if (resize) {
                    screen.width = options.screenWidth;
                    screen.height = options.screenHeight;
                }
                else {
                    screen.width = image.width;
                    screen.height = image.height;
                }
                context.drawImage(image, 0, 0, screen.width, screen.height);
                var imageData = context.getImageData(0, 0, screen.width, screen.height);
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
        }

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

        var gameboy = document.getElementById("gameboy");
        ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
            //stop the browser's default behavior of displaying the file when dragged in
            gameboy.addEventListener(eventName, (event) => event.preventDefault());
        });

        ["dragenter", "dragover"].forEach(eventName => {
            gameboy.addEventListener(eventName, () => gameboy.parentNode.classList.add("filedrop"));
        });

        ["dragleave", "drop"].forEach(eventName => {
            gameboy.addEventListener(eventName, () => gameboy.parentNode.classList.remove("filedrop"));
        });

        gameboy.addEventListener("drop", (event) => {
            handleFile(event.dataTransfer.files[0]);
        });

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

        function formatSizeForDisplay(bytes) {
            if (bytes < 1024) return bytes + " bytes";
            if (bytes < 1024 * 1024) return (bytes / 1024) + " KB";
            return (bytes / (1024 * 1024)) + " MB";
        }
    });
}({ fileSizeLimit: 1024 * 1024 * 2, screenWidth: 160, screenHeight: 144 }));