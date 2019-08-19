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
    caption_id: {
        type: String
    },
    caption: {
        type: String
    },
    status: {
        type: String //1:NEW, 2:VIEWED, 3:CAPTIONING, 4:CAPTIONED, 5:DELETED 
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
    }
});

module.exports = mongoose.model('Image', ImageSchema);
