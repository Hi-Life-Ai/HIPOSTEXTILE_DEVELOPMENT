const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RackSchema = new Schema({
    businesslocation: {
        type: String,
        required: false
    },
    assignbusinessid: {
        type: String,
        required: false
    },
    mainrack: {
        type: String,
        required: false
    },
    combinerack: [
        {
            subrackcode: {
                type: String,
                required: false
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Rack', RackSchema);