require('dotenv').config();
const Aws = require('aws-sdk');
const { appendSuffix } = require('../utils');

Aws.config.update({region: 'us-east-1'});
const Sqs = new Aws.SQS({ apiVersion: '2012-11-05' });
const S3 = new Aws.S3();

describe('imageReducerService', () => {

    test('end-to-end functionality', async () => {

        const event = { bucket: process.env.BUCKET, key: process.env.KEY };
        const params = {
          MessageBody: JSON.strigify(event),
          QueueUrl: process.env.SQS_QUEUE
        };
        await Sqs.sendMessage(params).promise();

        const reducedImageMetadata = await S3
            .headObject({ bucket: realBucket, key: appendSuffix(existingFileKey, 'png') }).promise();
        expect(reducedImageMetadata).toBeDefined();
    });
});
