const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    assignbusinessid: {
        type: String,
        required: false
    },
    brandname: {
        type: [String],
        required: false
    },
    categoryname: {
        type: [String],
        required: false
    },
    isBrandOptionSelected: {
        type: Boolean,
        required: false
    },
    isCategoryOptionSelected: {
        type: Boolean,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Group', groupSchema);