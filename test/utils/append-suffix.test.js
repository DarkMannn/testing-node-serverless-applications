const appendSuffix = require('../../utils/append-suffix.js');

describe('appendSuffix()', () => {

    test('successful making of a new file name', async () => {

        const oldFileName = 'big_picture.png';
        const newFileName = appendSuffix(oldFileName, 'jpeg');
        expect(newFileName).toBe('big_picture_reduced.jpeg');
    });
});
