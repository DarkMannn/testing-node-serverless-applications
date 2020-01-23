const Path = require('path');
const Fs = require('fs');
const Sharp = require('sharp');
const ImageReducer = require('../../adapters/image-reducer.js');

const BIG_IMAGE_PATH = Path.join(__dirname, '../big-lambda.png');
const SMALL_IMAGE_PATH_PNG = Path.join(__dirname, '../small-lambda.png');
const SMALL_IMAGE_PATH_WEBP = Path.join(__dirname, '../small-lambda.webp');
const SMALL_IMAGE_PATH_JPEF = Path.join(__dirname, '../small-lambda.jpeg');

describe('ImageReducer.createTransformable()', () => {

    describe('reducing size and transforming image in .png format and other defaults', () => {

        test('reducing image', async () => {

            const readable = Fs.createReadStream(BIG_IMAGE_PATH);
            const imageReductionTransformable = ImageReducer.createTransformable();
            const writable = Fs.createWriteStream(SMALL_IMAGE_PATH_PNG);

            readable.pipe(imageReductionTransformable).pipe(writable);
            await new Promise(resolve => writable.on('finish', resolve));

            const newImageMetadata = await Sharp(SMALL_IMAGE_PATH_PNG).metadata();
            expect(newImageMetadata.format).toBe('png');
            expect(newImageMetadata.width).toBe(320);
            expect(newImageMetadata.height).toBe(240);
        });
    });

    describe('reducing size and transforming image in .webp format', () => {

        test('reducing image', async () => {

            const readable = Fs.createReadStream(BIG_IMAGE_PATH);
            const imageReductionTransformable = ImageReducer.createTransformable('webp', 200, 100);
            const writable = Fs.createWriteStream(SMALL_IMAGE_PATH_WEBP);

            readable.pipe(imageReductionTransformable).pipe(writable);
            await new Promise(resolve => writable.on('finish', resolve));

            const newImageMetadata = await Sharp(SMALL_IMAGE_PATH_WEBP).metadata();
            expect(newImageMetadata.format).toBe('webp');
            expect(newImageMetadata.width).toBe(200);
            expect(newImageMetadata.height).toBe(100);
        });
    });

    describe('reducing size and transforming image in .jpeg format', () => {

        test('reducing image', async () => {

            const readable = Fs.createReadStream(BIG_IMAGE_PATH);
            const imageReductionTransformable = ImageReducer.createTransformable('jpeg', 200, 200);
            const writable = Fs.createWriteStream(SMALL_IMAGE_PATH_JPEF);

            readable.pipe(imageReductionTransformable).pipe(writable);
            await new Promise(resolve => writable.on('finish', resolve));

            const newImageMetadata = await Sharp(SMALL_IMAGE_PATH_JPEF).metadata();
            expect(newImageMetadata.format).toBe('jpeg');
            expect(newImageMetadata.width).toBe(200);
            expect(newImageMetadata.height).toBe(200);
        });
    });
});
