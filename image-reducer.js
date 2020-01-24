const Sharp = require('sharp');

const WIDTH = 320;
const HEIGHT = 240;

exports.createTransformable = (format = 'png', width = WIDTH, height = HEIGHT) =>
    format === 'jpeg' ? Sharp().resize(width, height).jpeg() :
    format === 'webp' ? Sharp().resize(width, height).webp() :
    Sharp().resize(width, height).png()
