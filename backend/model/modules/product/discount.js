const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const discountSchema = new Schema({
    name:{
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    products:{
        type: String,
        required: false
    },
    productid:{
        type:String,
        required:false
    },
    brand:{
        type: String,
        required: false
    },
    subbrand:{
        type: String,
        required: false
    },
    category:{
        type: String,
        required: false
    },
    subcategory:{
        type: String,
        required: false
    },
    businesslocation:{
        type: String,
        required: false
    },
    discounttype:{
        type: String,
        required: false
    },
    discountamt:{
        type: Number,
        required: false
    },
    startsat:{
        type: String,
        required: false
    },
    endsat:{
        type: String,
        required: false
    },
    discountvalue :{
        type:Number,
        required:false
    },
    discountid:{
        type:String,
        required:false
    },
    sellingvalue:{
        type:Number,
        required:false
    },
    purchaseexcludetax:{
        type:Number,
        required:false
    },
    pruchaseincludetax:{
        type:Number,
        required:false
    },
    selectdiscountprice:{
        type:String,
        required:false
    },
    prodid:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Discount', discountSchema);