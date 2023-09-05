const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    companyname:{
        type: String,
        required: false
    },
    email:{
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: [true, 'Please enter your password'],
        minlength: [6, 'Your password must be greater than 6 characters'],
        select:false
    },
    cpassword:{
        type: String,
        required: [false, 'Please enter your confirm password']
    },
    entrynumber: {
        type: Number,
        require: false
    },
    date: {
        type: String,
        require: false
    },
    businesslocation: [String],
    department: {
        type: String,
        require: false
    },
    role: {
        type: String,
        require: [true, "Please select user role!"]
    },
    counter: {
        type: String,
        require: false
    },
    userid: {
        type: String,
        require: false
    },
    dateofjoin: {
        type: String,
        require: false
    },
    staffname: {
        type: String,
        require: false
    },
    fathername: {
        type: String,
        require: false
    },
    gender: {
        type: String,
        require: false
    },
    bloodgroup: {
        type: String,
        require: false
    },
    dateofbirth: {
        type: String,
        require: false
    },
    religion: {
        type: String,
        require: false
    },
    nationality: {
        type: String,
        require: false
    },
    address: {
        type: String,
        require: false
    },
    areacity: {
        type: String,
        require: false
    },
    pincode: {
        type: Number,
        require: false
    },
    phonenum: {
        type: Number,
        require: false
    },
    otherphonenum: {
        type: Number,
        require: false
    },
    useractive: {
        type: Boolean,
        require: false
    },
    maritalstatus: {
        type: String,
        require: false
    },
    familydetails: {
        type: String,
        require: false
    },
    profileimage: {
        type: String,
        require: false
    },
    educationdetails: {
        type: String,
        require: false
    },
    experiencedetails: {
        type: String,
        require: false
    },
    jobdetails: {
        type: String,
        require: false
    },
    languageknown: {
        type: String,
        require: false
    },
    aadharnumber: {
        type: Number,
        require: false
    },
    accnumber: {
        type: Number,
        require: false
    },
    remarks: {
        type: String,
        require: false
    },
    country: {
        type: String,
        require: false
    },
    termscondition: {
        type: Boolean,
        require: false
    },
    state: {
        type: String,
        require: false
    },
    assignbusinessid: {
        type: String,
        require: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date

})

// generate password reset token
userSchema.methods.getResetPasswordToken = function() {
    // Generate token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // hash tht reset token
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // set token expires time
    this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model('User', userSchema);