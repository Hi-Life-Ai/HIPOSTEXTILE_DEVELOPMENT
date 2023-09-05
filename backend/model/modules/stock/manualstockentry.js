const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const ManualStockEntrySchema = new Schema({

    assignbusinessid: {
        type: String,
        required: false
    },
    businesslocation: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: false
    },
    subcategory: {
        type: String,
        required: false
    },
    brand: {
        type: String,
        required: false
    },
    subbrand: {
        type: String,
        required: false
    },
    size: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    },
    style: {
        type: String,
        required: false
    },
    unit: {
        type: String,
        required: false
    },
    margin: {
        type: String,
        required: false
    },
    suppliername: {
        type: String,
        required: false 
    },
    productname:{
        type: String,
        required: false
    },
    producttax:{
        type: String,
        required: false 
    },
    producttaxtype:{
        type: String,
        required: false
    },
    purchaserate:{
        type: String,
        required: false
    },
    alpha:{
        type: String,
        required: false
    },
    quantity:{
        type: String,
        required: false
    },
    totalquantity:{
        type: String,
        required: false
    },
    sellcostwithtax:{
        type: String,
        required: false
    },
    sellcostwithouttax:{
        type: String,
        required: false
    },
    sellingalpha:{
        type: String,
        required: false
    },
    saletaxamount:{
        type: String,
        required: false
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

module.exports = mongoose.model('ManualStockEntry', ManualStockEntrySchema);