const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const unitSchema = new Schema({
    unit:{
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    shortname:{
        type: String,
        required: false
    },
    allowdecimal:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Unit', unitSchema);