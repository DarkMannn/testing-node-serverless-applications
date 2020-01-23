const { promisify } = require('util');
const { PassThrough, pipeline } = require('stream');
const { generateRandomId, appendSuffix } = require('./utils');

const pipelineAsync = promisify(pipeline);

exports.imageReducerService = async (event, FileService, ImageReducer) => {

    const executionId = generateRandomId();
    try {
        console.log(`Started imageReducerService id: ${executionId}`);

        const { bucket, key, format } = event;

        const readable = FileService.fetchFileAsReadable(bucket, key);
        const imageReductionTransformable = ImageReducer.createTransformable(format);
        const writable = new PassThrough();

        const newKey = appendSuffix(key, format);
        const pipelineProcess = pipelineAsync(readable, imageReductionTransformable, writable);
        const uploadProcess = FileService.uploadFileAsWritable(bucket, newKey, writable);
        await Promise.all([pipelineProcess, uploadProcess]);

        console.log(`Finished imageReducerService id: ${executionId}`);
    }
    catch (error) {
        console.error(`Thrown imageReducerService id: ${executionId}`);
        throw error;
    }
};
