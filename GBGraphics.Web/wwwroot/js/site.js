/* jshint browser: true, devel: true, esnext: true */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var input = document.querySelector("input[type=file]");
    input.addEventListener("change", function () {
        var file = input.files[0];
        getFileData(file).then(function (base64DataUrl) {
            document.querySelector("img#before").src = base64DataUrl;
            document.querySelector("#file-name").innerHTML = file.name;
            document.querySelector("#file-size").innerHTML = file.size + " bytes";
            document.querySelector("#file-type").innerHTML = file.type;
            document.querySelector("img#after").src = "/img/loading-spinner.gif";

            var base64Data = base64DataUrl.split(",")[1];
            fetch("", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(base64Data)
            }).then(function (response) {
                return response.text();
            }).then(function (base64ResponseData) {
                document.querySelector("img#after").src = "data:image/png;base64, " + base64ResponseData;
            })
        });
    }, false);

    function getFileData(file) {
        var reader = new FileReader();
        return new Promise(function (resolve, reject) {
            reader.addEventListener("load", function () {
                resolve(reader.result);
            }, false);
            reader.readAsDataURL(file);
        });
    }
}, false);