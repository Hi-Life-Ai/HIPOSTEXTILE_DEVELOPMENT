const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cusgroupSchema = new Schema({

    cusgroupid:{
        type: String,
        required: false
    },
    cusgroupname:{
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
    }

})

module.exports = mongoose.model('Customergroup', cusgroupSchema);
