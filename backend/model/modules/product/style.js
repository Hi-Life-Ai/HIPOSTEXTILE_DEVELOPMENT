const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const styleSchema = new Schema({
    stylename:{
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
module.exports = mongoose.model('Style', styleSchema);