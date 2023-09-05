const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const posSchema = new Schema({
    assignbusinessid:{
        type: String,
        required: false
    },
    today:{
        type: String,
        required: false
    },
    businesslocation: {
        type: String,
        required: false
    },
    referenceno:{
        type: String,
        required: false,
    },
    customer:{
        type: String,
        required: false,
    },
    date:{
        type: String,
        required: false,
    },
    counter:{
        type: String,
        required: false,
    },
    location:{
        type: String,
        required: false
    },
    contactnumber:{
        type: Number,
        required: false
    },
    contactid:{
        type: String,
        required: false
    },
    email:{
        type:String,
        required:false
    },
    creditlimit:{
        type: Number,
        required: false,
    },
    ledgerbalance:{
        type: Number,
        required: false,
    },
    goods: [
        {
            businesslocation:{
                type: String,
                required: false
            },
           productname:{
            type: String,
            requried: false,
           },
           quantity:{
            type: Number,
            requried: false,
           },
           stockid:{
            type: String,
            requried: false,
           },
           sellingpricetax:{
            type: String,
            requried: false,
           },
           taxtareval:{
            type: Number,
            requried: false,
           },
           discountvalue:{
            type: String,
            requried: false,
           },
           sellingincludevalue:{
            type: Number,
            requried: false,
           },
           sellingexcludevalue:{
            type: Number,
            requried: false,
           },
           applicabletax:{
            type: String,
            requried: false,
           },
           discountamt:{
            type: Number,
            requried: false,
           },
           subtotal:{
            type: Number,
            requried: false,
           },
           productid:{
            type: String,
            requried: false,
           },
        }
    ],
    totalitems:{
        type: Number,
        required: false,
    },
    totalproducts:{
        type: Number,
        required: false,
    },
    grandtotal:{
        type: Number,
        required: false,
    },
    ordertax:{
        type: String,
        required: false,
    },
    shippingtax:{
        type: Number,
        required: false,
    },
    packcharge:{
        type: Number,
        required: false,
    },
    granddistype:{
        type: String,
        required: false,
    },
    gdiscountvalue:{
        type: Number,
        required: false,
    },
    gdiscountamtvalue:{
        type: Number,
        required: false,
    },
    aftergranddisctotal:{
        type: Number,
        required: false,
    },
    totalbillamt:{
        type: Number,
        required: false,
    },
    amountgain:{
        type: Number,
        required: false
    },
    balance:{
        type: Number,
        required: false
    },
    totaldiscountvalue:{
        type: Number,
        required: false
    },
    userbyadd:{
        type: String,
        required: false
    },
    roundof:{
        type:Number,
        required:false
    },
    customerledgeid:{
        type:String,
        required:false
    },
    dueamount:{
        type:Number,
        required:false
    },
    paymentstatus:{
        type:String,
        required:false
    },
    paymentmethod:{
        type:String,
        required:false
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
})
module.exports = mongoose.model('Pos', posSchema);