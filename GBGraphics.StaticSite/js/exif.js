/* jshint browser: true, bitwise: false */
/* exported exif */
var exif = function () {
    "use strict";
    //https://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side/32490603#32490603
    function getOrientation(file, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var view = new DataView(e.target.result);
            if (view.getUint16(0, false) != 0xFFD8) {
                return callback(-2);
            }
            var length = view.byteLength, offset = 2;
            while (offset < length) {
                if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) {
                        return callback(-1);
                    }
                    var little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++) {
                        if (view.getUint16(offset + (i * 12), little) == 0x0112) {
                            return callback(view.getUint16(offset + (i * 12) + 8, little));
                        }
                    }
                }
                else if ((marker & 0xFF00) != 0xFF00) {
                    break;
                }
                else {
                    offset += view.getUint16(offset, false);
                }
            }
            return callback(-1);
        };
        reader.readAsArrayBuffer(file);
    }

    //https://stackoverflow.com/a/40867559/7512368
    function configureCanvas(canvas, image, orientation) {
        if (orientation >= 5 && orientation <= 8) {
            canvas.width = image.height;
            canvas.height = image.width;
        }
        else {
            canvas.width = image.width;
            canvas.height = image.height;
        }
    }

    //https://stackoverflow.com/a/40867559/7512368
    function configureContext(context, image, orientation) {
        switch (orientation) {
            case 2: context.transform(-1, 0, 0, 1, image.width, 0); break;
            case 3: context.transform(-1, 0, 0, -1, image.width, image.height); break;
            case 4: context.transform(1, 0, 0, -1, 0, image.height); break;
            case 5: context.transform(0, 1, 1, 0, 0, 0); break;
            case 6: context.transform(0, 1, -1, 0, image.height, 0); break;
            case 7: context.transform(0, -1, -1, 0, image.height, image.width); break;
            case 8: context.transform(0, -1, 1, 0, 0, image.width); break;
        }
    }

    return {
        getOrientation: getOrientation,
        configureCanvas: configureCanvas,
        configureContext: configureContext
    };
}();