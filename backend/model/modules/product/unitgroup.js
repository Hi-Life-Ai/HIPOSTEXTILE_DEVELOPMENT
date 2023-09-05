const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const unitgroupingSchema = new Schema({
    assignbusinessid:{
        type: String,
        required: false
    },
    unit:{
        type: String,
        required: false
    },
    quantity:{
        type: Number,
        required: false
    },
    unitgrouping:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('UnitGrouping', unitgroupingSchema);