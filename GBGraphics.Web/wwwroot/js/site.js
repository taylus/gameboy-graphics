/* jshint browser: true, devel: true, esnext: true */
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    var input = document.querySelector("input[type=file]");
    input.addEventListener("change", function () {
        var file = input.files[0];
        getFileData(file).then(function (base64DataUrl) {
            document.querySelector("img#preview").src = base64DataUrl;
            document.querySelector("#file-name").innerHTML = file.name;
            document.querySelector("#file-size").innerHTML = file.size + " bytes";
            document.querySelector("#file-type").innerHTML = file.type;

            var base64Data = base64DataUrl.split(",")[1];
            //TODO: POST this back to the server for processing
            alert("Got image data: " + base64Data);
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