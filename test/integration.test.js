require('dot-env').config();

const { EventParser, FileService, ImageReducer }= require('../adapters');
const ImageReducerService = require('../main.js');

const createFakeSqsMessage = (payload) => { Records: [{ body: payload }] };

describe('ImageReducerService', () => {

    test('integration', async () => {

        const realBucket = process.env.BUCKET;
        const existingFileKey = process.env.KEY;
        const sqsMessage = createFakeSqsMessage({
            bucket: realBucket,
            key: existingFileKey
        });

        await ImageReducerService(EventParser.parse(sqsMessage), FileService, ImageReducer);

        const reducedImageMetadata = await FileService.S3
            .headObject({ bucket: realBucket, key: `${key}_reduced.${format}`}).promise();
        expect(reducedImageMetadata).toBeDefined();
    });
});
