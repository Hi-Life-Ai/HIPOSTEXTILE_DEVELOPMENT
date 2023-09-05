const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const departmentSchema = new Schema({

    assignbusinessid:{
        type: String,
        required: false
    },
    departmentid: {
        type: String,
        required: false
    },
    departmentname: {
        type: String,
        required: false
    },
        
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Department', departmentSchema);