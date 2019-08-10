/* jshint browser: true, bitwise: false */
/* exported exif */
/**
 * Contains functions for parsing image orientation from EXIF metadata.
 * Also provides functions for configuring a canvas and context for drawing the image properly oriented.
 * @see https://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side
 * @see https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images/40867559#40867559
 */
var exif = function () {
    "use strict";
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

    function configureCanvas(canvas, source, orientation) {
        if (orientation >= 5 && orientation <= 8) {
            canvas.width = source.height;
            canvas.height = source.width;
        }
        else {
            canvas.width = source.width;
            canvas.height = source.height;
        }
    }

    function configureContext(context, source, orientation) {
        switch (orientation) {
            case 2: context.transform(-1, 0, 0, 1, source.width, 0); break;
            case 3: context.transform(-1, 0, 0, -1, source.width, source.height); break;
            case 4: context.transform(1, 0, 0, -1, 0, source.height); break;
            case 5: context.transform(0, 1, 1, 0, 0, 0); break;
            case 6: context.transform(0, 1, -1, 0, source.height, 0); break;
            case 7: context.transform(0, -1, -1, 0, source.height, source.width); break;
            case 8: context.transform(0, -1, 1, 0, 0, source.width); break;
        }
    }

    return {
        getOrientation: getOrientation,
        configureCanvas: configureCanvas,
        configureContext: configureContext
    };
}();