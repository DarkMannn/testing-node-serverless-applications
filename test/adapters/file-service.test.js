const FileService = require('../../adapters/file-service.js');

describe('FileService', () => {

    describe('fetchFileAsReadable()', () => {

        test('throws if parameters is are undefined', async () => {

            expect(() => FileService.fetchFileAsReadable())
                .toThrow('"bucket" and "key" parameters must be defined');
        });
    });

    describe('uploadFileAsWritable()', () => {
        it('throws if last argument is not a writable stream', async () => {

            expect(() => FileService.uploadFileAsWritable('bucket', 'key', {}))
                .toThrow('"writable" must be an instance of stream.Writable class');
        });
    });
});
