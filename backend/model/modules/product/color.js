const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const colorSchema = new Schema({
    colorname:{
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
module.exports = mongoose.model('Color', colorSchema);