const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    image_id: {
        type: String,
        unique: true,
        require: true
    },
    user_id: {
        type: String,
        require: true
    },
    url: {
        type: String
    },
    color: {
        type: Array
    },
    caption_id: {
        type: String
    },
    caption: {
        type: String
    },
    status: {
        type: String //1:NEW, 2:VIEWED, 3:CAPTIONING, 4:CAPTIONED, 5:DELETED, 6:INVALID 
    },
    created: {
        type: Date, default: Date.now
    },
    updated: {
        type: Date, default: Date.now
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    interActiveStatus: {
        type: String, default: '0' //0:Need, 1: Commented, 2: Error Commented, 3: No Need
    },
    port: {
        type: String, default: '5000'
    }
});

module.exports = mongoose.model('Image', ImageSchema);
