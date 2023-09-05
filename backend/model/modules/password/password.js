const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
    passwordcode: {
        type: String,
        required: false,
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    name: {
        type: String,
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        select: true,
    },
    totpkey: {
        type: String,
        required: false,
    },
    curtotpkey: {
        type: String,
        required: false,
    },
    notes: {
        type: String,
        required: false,
    },
    url: {
        type: String,
        required: false,
    },
    logo: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Password', passwordSchema)