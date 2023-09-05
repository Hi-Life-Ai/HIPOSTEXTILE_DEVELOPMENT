const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const supplierSchema = new Schema({

    autogenerate: {
        type: String,
        required: false,
    }, 
    assignbusinessid:{
        type: String,
        required: false
    },
    suppliername: {
        type: String,
        required: false,
    }, 
    suppshortname: {
        type: String,
        required: false,
    },
    addressone: {
        type: String,
        required: false,
    }, 
    addresstwo: {
        type: String,
        required: false,
    }, 
    country: {
        type: String,
        required: false,
    },
    state: {
        type: String,
        required: false,
    }, 
    city: {
        type: String,
        required: false,
    }, 
    pincode: {
        type: Number,
        required: false,
    }, 
    supplieremail:{
        type: String,
        required: false,
    },
    gstn: {
        type: String,
        required: false,
    }, 
    phoneone: {
        type: Number,
        required: false,
    }, 
    phonetwo: {
        type: Number,
        required: false,
    },
    phonethree: {
        type: Number,
        required: false,
    }, 
    phonefour: {
        type: Number,
        required: false,
    }, 
    landline:{
        type: String,
        required: false,
    },
    whatsapp: {
        type: Number,
        required: false,
    }, 
    contactperson: {
        type: String,
        required: false,
    },
    creditdays: {
        type: Number,
        required: false,
    },
    bankdetails: [
        {
            branchname: {
                type: String,
                required: false,
            },
            bankname: {
                type: String,
                required: false,
            },
            ifsccode: {
                type: String,
                required: false,
            },        
            accno: {
                type: String,
                required: false,
            },
            accholdername: {
                type: String,
                required: false,
            },
            bankdetails: [
                {
                    branchname: {
                        type: String,
                        required: false,
                    },
                    bankname: {
                        type: String,
                        required: false,
                    },
                    ifsccode: {
                        type: String,
                        required: false,
                    },        
                    accno: {
                        type: String,
                        required: false,
                    },
                    accholdername: {
                        type: String,
                        required: false,
                    },
        
                }],

        }],
    createdAt:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Supplier', supplierSchema);