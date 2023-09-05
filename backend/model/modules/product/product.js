const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const productSchema = new Schema({
    productname: {
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    sku: {
        type: String,
        required: false
    },
    barcodetype:  {
        type: String,
        required: false
    },
    unit:  {
        type: String,
        required: false
    },
    brand:  {
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
    subbrand: {
        type: String,
        required: false
    },
    brandshotname:  {
        type: String,
        required: false
    },
    categoryshotname: {
        type: String,
        required: false
    },
    subcategryshotname: {
        type: String,
        required: false
    },
    subbrandshotname: {
        type: String,
        required: false
    },
    businesslocation:  {
        type: String,
        required: false
    },
    managestock:  {
        type: Boolean,
        required: false
    },
    hsnenable:{
        type:Boolean,
        required:false
    },
    currentstock:{
        type: Number,
        required: false
    },
    productdescription:  {
        type: String,
        required: false
    },
    productimage:  {
        type: String,
        required: false
    },
    applicabletax: {
        type: String,
        required: false
    },
    sellingpricetax: {
        type: String,
        required: false
    },
    producttype: {
        type: String,
        required: false
    },
    rack:{
        type: String,
        required: false
    },
    purchaseexcludetax:  {
        type: Number,
        required: false
    },
    pruchaseincludetax: {
        type: Number,
        required: false
    },
    sellingexcludetax: {
        type: Number,
        required: false
    },
    sellunitcostwithouttax: {
        type: Number,
        required: false
    },
    minquantity: {
        type: Number,
        required: false
    },
    maxquantity: {
        type: Number,
        required: false
    },
    size:{ 
        type: String,
        required: false
    },
    style:{ 
        type: String,
        required: false
    },
    hsn:{
        type: String,
        required: false
    },
    expirydatechk:{
        type: Boolean,
        required: false
    },
    expirydate:{
        type: String,
        required: false
    },
    color:{
        type: String,
        required: false
    },
    hsncode:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Product', productSchema);
