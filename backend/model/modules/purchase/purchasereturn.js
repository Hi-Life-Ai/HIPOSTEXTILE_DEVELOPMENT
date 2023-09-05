const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const preturnSchema = new Schema({
    assignbusinessid:{
        type: String,
        required: false
    },
    supplier: {
        type: String,
        required: true
    },
    today:{
        type: String,
        required: false
    },
    referenceno: {
        type: String,
        required: false
    },
    purchasedate: {
        type: String,
        required: false
    },
    purchasestatus: {
        type: String,
        required: false
    },
    addressone: {
        type: String,
        required: false
    },
    billamount:{
        type:Number,
        required: false
    },
    businesslocation: {
        type: String,
        required: false
    },
    invoiceno:{
        type: String,
        required: false
    },
    payterm: {
        type: String,
        required: false
    },
    paytermselect: {
        type: String,
        required: false
    },
    attachdoc: {
        type: String,
        required: false
    },
    purchaseorder: {
        type: String,
        required: false
    },
    products:[
        {  
            produniqid: {
                type: String,
                required: false
            },
    prodname: {
        type: String,
        required: false
    },
    supplier:{
        type: String,
        required: false
    },
    date:{
        type: String,
        required: false
    },
    sku: {
        type: String,
        required: false
    },
    hsn: {
        type: String,
        required: false
    },
    hsntax: {
        type: String,
        required: false
    },
    applicabletax:{
        type: String,
        required: false
    },
    applicabletaxrate:{
        type: String,
        required: false
    },
    lotnumber: {
        type: String,
        required: false
    },
    purchasetabletax: {
        type: String,
        required: false
    },
    purchasetax: {
        type: String,
        required: false
    },
    sellingpricetax: {
        type: String,
        required: false
    },
    enteramt:{
        type: String,
        required: false
    },
    margin: {
        type: String,
        required: false
    },
    purchaseexcludetax: {
        type: String,
        required: false
    }, 
    pruchaseincludetax: {
        type: String,
        required: false
    },
    excalpha: {
        type: String,
        required: false
    },
    incalpha: {
        type: String,
        required: false
    },
    quantity: {
        type: String,
        required: false
    }, 
    returnquantity: {
        type: String,
        required: false
    },
    purchasenetcost: {
        type: Number,
        required: false
    },
    distypemod: {
        type: String,
        required: false
    },
    disvaluemod: {
        type: String,
        required: false
    },
    differenceamt: {
        type: String,
        required: false
    },
    ratebydismod: {
        type: String,
        required: false
    },
    sellingpriceunitcost: {
        type: String,
        required: false
    },
    molecules:{
        type: String,
        required: false
    },
    manufacture:{
        type: String,
        required: false
    },
    category:{
        type: String,
        required: false
    },
    expirydate:{
        type: String,
        required: false
    },
    packingcharge:{
        type: String,
        required: false
    },
    batch:{
        type: String,
        required: false
    },
        }
    ],
    returnproducts:[
        {  
            produniqid: {
                type: String,
                required: false
            },
    prodname: {
        type: String,
        required: false
    },
    supplier:{
        type: String,
        required: false
    },
    date:{
        type: String,
        required: false
    },
    sku: {
        type: String,
        required: false
    },
    hsn: {
        type: String,
        required: false
    },
    hsntax: {
        type: String,
        required: false
    },
    applicabletax:{
        type: String,
        required: false
    },
    applicabletaxrate:{
        type: String,
        required: false
    },
    lotnumber: {
        type: String,
        required: false
    },
    purchasetabletax: {
        type: String,
        required: false
    },
    purchasetax: {
        type: String,
        required: false
    },
    sellingpricetax: {
        type: String,
        required: false
    },
    enteramt:{
        type: String,
        required: false
    },
    margin: {
        type: String,
        required: false
    },
    purchaseexcludetax: {
        type: String,
        required: false
    }, 
    pruchaseincludetax: {
        type: String,
        required: false
    },
    excalpha: {
        type: String,
        required: false
    },
    incalpha: {
        type: String,
        required: false
    },
    quantity: {
        type: String,
        required: false
    }, 
    returnquantity: {
        type: String,
        required: false
    },
    purchasenetcost: {
        type: Number,
        required: false
    },
    distypemod: {
        type: String,
        required: false
    },
    disvaluemod: {
        type: String,
        required: false
    },
    differenceamt: {
        type: String,
        required: false
    },
    ratebydismod: {
        type: String,
        required: false
    },
    sellingpriceunitcost: {
        type: String,
        required: false
    },
    molecules:{
        type: String,
        required: false
    },
    manufacture:{
        type: String,
        required: false
    },
    category:{
        type: String,
        required: false
    },
    expirydate:{
        type: String,
        required: false
    },
    packingcharge:{
        type: String,
        required: false
    },
    batch:{
        type: String,
        required: false
    },
        }
    ],
    grandtotal:{
        type:Number,
        required:false
    },
    totalcnt:{
        type: Number,
        required: false
    },
    subcost:{
        type: Number,
        required: false
    },
    totaldiscount:{
        type: Number,
        required: false
    },
    totalitem:{
        type: Number,
        required: false
    },
    nettotal: {
        type: Number,
        required: false
    },
    additionalnotes: {
        type: String,
        required: false
    },
    advancebalance: {
        type: Number,
        required: false
    },
    payamount:{
        type: Number,
        required: false
    },
    paidon: {
        type: String,
        required: false
    },
    paymentmethod:{
        type:String,
        required:false
    },
    balance:{
        type: Number,
            required: false
    },
    expirydate:{
        type: String,
        required: false
    },
    currentstock:{
        type: Number,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Purchasereturn', preturnSchema);