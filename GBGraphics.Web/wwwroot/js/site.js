/* jshint browser: true, devel: true */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var input = document.querySelector("input[type=file]");
    input.addEventListener("change", function () {
        var formData = new FormData();
        formData.append("img", input.files[0]);
        //TODO: let user select color palette ala https://codepen.io/taylus/pen/OKxqNM
        formData.append("colors", "#e0f8d0");
        formData.append("colors", "#88c070");
        formData.append("colors", "#346856");
        formData.append("colors", "#081820");
        var screen = document.getElementById("screen");
        if (screen) {
            screen.src = "/img/loading-spinner.gif";
            screen.style.display = "inline";
        }
        fetch("", {
            method: "POST",
            body: formData
        }).then(function (response) {
            return response.blob();
        }).then(function (response) {
            if (screen) screen.src = URL.createObjectURL(response);
        });
    });
}, false);