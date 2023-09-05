const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const alphaSchema = new Schema({
    assignbusinessid:{
        type: String,
        required: false
    },
    1:{
        type: String,
        required: true
    },
    2:{
        type: String,
        required: true
    },
    3: {
        type: String,
        required: true
    },
    4:{
        type: String,
        required: true
    },
    5:{
        type: String,
        required: true
    },
    6: {
        type: String,
        required: true
    },
    7:{
        type: String,
        required: true
    },
    8:{
        type: String,
        required: true
    },
    9: {
        type: String,
        required: true
    },
    0:{
        type: String,
        required: true
    },
    one:{
        type: Number,
        required: true
    },
    two:{
        type: Number,
        required: true
    },
    three:{
        type: Number,
        required: true
    },
    four:{
        type: Number,
        required: true
    },
    five: {
        type: Number,
        required: true
    },
    six: {
        type: Number,
        required: true
    },
    seven:{
        type: Number,
        required: true
    },
    eight:{
        type: Number,
        required: true
    },
    nine:{
        type: Number,
        required: true
    },
    zero:{
        type: Number,
        required: true
    },
    activate:{
        type:Boolean,
        required:false
    },
    alphaid:{
        type: String,
        required: false
    },
    singledigit:{
        type: String,
        required: false
    },
    doubledigit:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Alpharate', alphaSchema);