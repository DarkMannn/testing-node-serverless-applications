const { EventParser, FileService } = require('./adapters');
const ImageReducer = require('./image-reducer.js');
const ImageReducerService = require('./main.js');

exports.handler = (sqsMessage) =>
    ImageReducerService(EventParser.parse(sqsMessage), FileService, ImageReducer);
