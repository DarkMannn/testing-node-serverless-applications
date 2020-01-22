const { EventParser, FileService, ImageReducer }= require('./adapters');
const ImageReducerService = require('./main.js');

exports.handler = (sqsMessage) =>
    ImageReducerService(EventParser.parse(sqsMessage), FileService, ImageReducer);
