const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const payintegrationSchema = new Schema({
    assignbusinessid:{
        type: String,
        required: false
    },
    businesslocation: {
        type: String,
        required: false
    },
    cash: {
        type: Boolean,
        required: false
    },
    card: {
        type: Boolean,
        required: false
    },
    cheque: {
        type: Boolean,
        required: false
    },
    bank: {
        type: Boolean,
        required: false
    },
    upi: {
        type: Boolean,
        required: false
    },
    cardnum: {
        type: String,
        required: false
    },
    cardhname: {
        type: String,
        required: false
    },
    cardtransnum: {
        type: String,
        required: false
    },
    cardtype: {
        type: String,
        required: false
    },
    month: {
        type: String,
        required: false
    },
    year: {
        type: String,
        required: false
    },
    securitycode: {
        type: String,
        required: false
    },
    checkno: {
        type: String,
        required: false
    },
    baccno: {
        type: String,
        required: false
    },
    upino: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Paymentintegration', payintegrationSchema);






