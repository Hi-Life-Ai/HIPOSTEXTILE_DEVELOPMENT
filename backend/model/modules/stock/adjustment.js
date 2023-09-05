const mongoose = require('mongoose')

const Schema = mongoose.Schema;


const StockAjustmentSchema = new Schema({

    assignbusinessid: {
        type: String,
        required: false
    },
    businesslocation: {
        type: String,
        required: false
    },
    section: {
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

    today: {
        type: String,
        required: false,
    },
    transferproducts:[
        {
            productname:{
                type: String,
                required: false
            },
            sku:{
                type: String,
                required: false
            },
            quantity:{
                type: String,
                required: false
            },
            supplier:{
                type: String,
                required: false
            },
            currentstock:{
                type: String,
                required: false
            },
            purchasequantity:{
                type: String,
                required: false
            },
            remainingstockquantity:{
                type: String,
                required: false
            },
            date:{
                type: String,
                required: false
            },
            adjustmentmode:{
                type: String,
                required: false
            },
            adjustmenttype:{
                type: String,
                required: false
            },
            adjustmentcount:{
                type: String,
                required: false
            },
            balancecount:{
                type: String,
                required: false
            },
        }
    ],
    
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Stockajustment', StockAjustmentSchema);