const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    uuid: {
        type: uuid
    },
    userUuid: {
        type: uuid
    },
    url: {
        type: String
    },
    caption: {
        type: String
    }
});