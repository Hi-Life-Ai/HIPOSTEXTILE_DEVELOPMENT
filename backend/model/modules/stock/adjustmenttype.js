const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const AdjustmentSchema = new Schema({

    assignbusinessid: {
        type: String,
        required: false
    },
    adjustmentitem: {
        type: String,
        required: false,
    },
    mode: {
        type: String,
        required: false,
    },
    today: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Adjustment', AdjustmentSchema);