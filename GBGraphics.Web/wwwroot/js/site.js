/* jshint browser: true, devel: true */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var input = document.querySelector("input[type=file]");
    input.addEventListener("change", function () {
        var file = input.files[0];
        var formData = new FormData();
        formData.append("img", file);
        document.querySelector("img#before").src = URL.createObjectURL(file);
        document.querySelector("#file-name").innerHTML = file.name;
        document.querySelector("#file-size").innerHTML = file.size + " bytes";
        document.querySelector("#file-type").innerHTML = file.type;
        document.querySelector("img#after").src = "/img/loading-spinner.gif";
        fetch("", {
            method: "POST",
            body: formData
        }).then(function (response) {
            return response.blob();
        }).then(function (response) {
            document.querySelector("img#after").src = URL.createObjectURL(response);
        });
    });
}, false);