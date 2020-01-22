const { PassThrough, pipeline } = require('stream');
const { promisify } = require('util');

const pipelineAsync = promisify(pipeline);
const generateRandomId = () => Math.random().toString(36).slice(2);

exports.imageReducerService = async (event, FileService, ImageReducer) => {

    try {
        const executionId = generateRandomId();
        console.log(`Started imageReducerService id: ${executionId}`);

        const { bucket, key, format } = event;

        const readable = FileService.fetchFileAsReadable(bucket, key);
        const imageReductionTransformable = ImageReducer.createTransformable(format);
        const writable = new PassThrough();

        const newKey = `${key}_reduced.${format}`;
        const pipelineProcess = pipelineAsync(readable, imageReductionTransformable, writable),
        const uploadProcess = FileService.uploadFileAsWritable(bucket, newKey, writable)
        await Promise.all([pipelineProcess, uploadProcess]);

        console.log(`Finished imageReducerService id: ${executionId}`);
    }
    catch (error) {
        console.error(`Thrown imageReducerService id: ${executionId}`);
        throw error;
    }
};
