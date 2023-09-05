const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    foldername: {
        type: String,
        required: false,
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false,
    },
    passwordnames: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Folder', folderSchema)