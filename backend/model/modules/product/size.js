const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sizeSchema = new Schema({
    sizename:{
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Size', sizeSchema);