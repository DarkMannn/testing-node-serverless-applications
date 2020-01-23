require('dotenv').config();

const { EventParser, FileService, ImageReducer } = require('../adapters');
const { imageReducerService } = require('../main.js');
const { appendSuffix } = require('../utils');

const createFakeSqsMessage = (payload) => ({ Records: [{ body: payload }] });

describe('ImageReducerService', () => {

    test('integration', async () => {

        const realBucket = process.env.BUCKET;
        const existingFileKey = process.env.KEY;
        const sqsMessage = createFakeSqsMessage({
            bucket: realBucket,
            key: existingFileKey
        });

        await imageReducerService(EventParser.parse(sqsMessage), FileService, ImageReducer);

        const reducedImageMetadata = await FileService.S3
            .headObject({ bucket: realBucket, key: appendSuffix(existingFileKey, 'png') }).promise();
        expect(reducedImageMetadata).toBeDefined();
    });
});
