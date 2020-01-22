const EventParser = require('../adapters/event-parser.js');
const createStubbedSqsMessage = (payload) => ({ Records: [{ body: payload }] });

describe('EventParser.parse() ', () => {

    test('returns parsed params when event object has all required properties with right type', async () => {

        const payload = {
            bucket: 'bucket',
            key: 'key',
            format: 'jpeg'
        };
        const stubbedSqsMessage = createStubbedSqsMessage(payload);

        const result = EventParser.parse(stubbedSqsMessage);

        expect(result).toBeDefined();
        expect(result.bucket).toBe(payload.bucket);
        expect(result.key).toBe(payload.key);
        expect(result.format).toBe(payload.format);
    });

    test('throws when event object has missing required params', async () => {

        const payload = {
            bucket: 'bucket'
        };
        const stubbedSqsMessage = createStubbedSqsMessage(payload);

        expect(() => EventParser.parse(stubbedSqsMessage)).toThrow();
    });

    test('throws when event object has required params but with incorrect type', async () => {

        const payload = {
            bucket: ['bucket'],
            key: 'key'
        };
        const stubbedSqsMessage = createStubbedSqsMessage(payload);

        expect(() => EventParser.parse(stubbedSqsMessage)).toThrow();
    });
});
