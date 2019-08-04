/* jshint esversion: 6, browser: true, devel: true */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    //colorize the image when the input file changes
    var input = document.querySelector("input[type=file]");
    input.addEventListener("change", () => colorizeImage(input.files[0]));
    var latestImage = input.files[0];

    //or when the palette changes while an input file is selected
    document.querySelectorAll("input[type=radio]").forEach((radio) => {
        radio.addEventListener("change", () => colorizeImage(latestImage));
    });

    //or when the resize checkbox changes while an input file is selected
    document.getElementById("resize").addEventListener("change", () => colorizeImage(latestImage));

    function colorizeImage(file) {
        if (!file) return;
        latestImage = file;

        var screen = document.getElementById("screen");
        screen.src = "/img/loading-spinner.gif";
        screen.style.display = "inline";

        fetch("", {
            method: "POST",
            body: buildRequest()
        }).then((response) => response.blob())
        .then((response) => screen.src = URL.createObjectURL(response));

        function buildRequest() {
            var formData = new FormData();
            formData.append("img", file);

            var palette = getSelectedColors();
            palette.forEach((color) => formData.append("colors", color));

            var resize = document.getElementById("resize").checked;
            formData.append("resize", resize);

            return formData;
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
            colorizeImage(latestImage);
        });

        //select the "use custom colors" radio button when a color input is clicked
        input.addEventListener("click", () => {
            document.getElementById("custom").checked = true;
            colorizeImage(latestImage);
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
        colorizeImage(event.dataTransfer.files[0]);
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
});