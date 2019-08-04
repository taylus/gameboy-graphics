/* jshint esversion: 6, browser: true, devel: true */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    //colorize the image when the input file changes
    var input = document.querySelector("input[type=file]");
    input.addEventListener("change", function () {
        colorizeImage();
    });

    //or when the palette changes while an input file is selected
    document.querySelectorAll("input[type=radio]").forEach(function (radio) {
        radio.addEventListener("change", function () {
            colorizeImage();
        }, false);
    });

    //or when the resize checkbox changes while an input file is selected
    document.getElementById("resize").addEventListener("change", function () {
        colorizeImage();
    }, false);

    function colorizeImage() {
        var file = input.files[0];
        if (!file) return;

        var screen = document.getElementById("screen");
        if (screen) {
            screen.src = "/img/loading-spinner.gif";
            screen.style.display = "inline";
        }
        fetch("", {
            method: "POST",
            body: buildRequest()
        }).then(function (response) {
            return response.blob();
        }).then(function (response) {
            if (screen) screen.src = URL.createObjectURL(response);
        });

        function buildRequest() {
            var formData = new FormData();
            formData.append("img", file);

            var palette = getSelectedColors();
            palette.forEach(function (color) {
                formData.append("colors", color);
            });

            var resize = document.getElementById("resize").checked;
            formData.append("resize", resize);

            return formData;
        }
    }

    //fill color palette labels with their (hidden) color input's color
    //since <input type="color"> looks gross and is largely unstylable
    //https://stackoverflow.com/a/26086382/7512368
    document.querySelectorAll("label.color-swatch").forEach(function (label) {
        var color = label.querySelector("input[type=color]").value;
        label.style.backgroundColor = color;
    });

    document.querySelectorAll("input[type=color]").forEach(function (input) {
        //update the label's background color when a color input changes
        input.addEventListener("change", function () {
            this.parentNode.style.backgroundColor = this.value;
            colorizeImage();
        }, false);

        //select the "use custom colors" radio button when a color input is clicked
        input.addEventListener("click", function () {
            document.getElementById("custom").checked = true;
            colorizeImage();
        }, false);
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
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }
}, false);