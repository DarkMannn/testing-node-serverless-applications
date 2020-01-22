const { PassThrough } = require('stream');

const generateRandomId = () => Math.random().toString(36).slice(2);

exports.imageReducerService = async (event, FileService, ImageReducer) => {

    try {
        const executionId = generateRandomId();
        console.log(`Started imageReducerService id: ${executionId}`);

        const { bucket, key, format } = event;

        const readable = FileService.fetchFileAsReadable(bucket, key);
        const imageReductionTransformable = ImageReducer.createTransformable(format);
        const writable = new PassThrough();

        readable.pipe(imageReductionTransformable).pipe(writable);
        await FileService.uploadFileAsWritable(bucket, key, writable);

        console.log(`Finished imageReducerService id: ${executionId}`);
    }
    catch (error) {
        console.error(`Thrown imageReducerService id: ${executionId}`);
        throw error;
    }
};
