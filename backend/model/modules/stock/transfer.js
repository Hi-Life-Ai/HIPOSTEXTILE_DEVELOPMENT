const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const transferSchema = new Schema({
   
    assignbusinessid:{
        type:String,
        required:false
    },
    date:{
        type:String,
        required:false
    },
    products :[
    {
        productname:{
            type:String,
            required: false
        },
        productcode:{
            type:String,
            required: false
        },
        currentstock:{
            type:Number,
            required: false
        },
        unit:{
            type:String,
            required:false
        },
        category:{
            type:String,
            required:false
        },
        subcategory:{
            type:String,
            required:false
        },
        brand:{
            type:String,
            required:false
        },
        size:{
            type:String,
            required:false
        },
        color:{
            type:String,
            required:false
        },
        sellingpricetaxtype:{
            type:String,
            required:false
        },
        productuniqid:{
            type:String,
            required: false
        },
        quantity:{},
        locations:[String],
    }
    ], 
    fromlocation:{
        type:String,
        required:false
    },
    status:{
        type:Boolean,
        required:false
    },
    reject:{
        type:Boolean,
        required:false
    },
    tobusinesslocations:[String],
    createdAt:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Transfer', transferSchema);