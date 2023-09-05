const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taxrateSchema = new Schema({
    assignbusinessid:{
        type: String,
        required: false
    },
    taxname:{
        type: String,
        required: [false, 'Please enter tax name']
    },
    taxrate:{
        type: Number,
        required: false
    },
    taxtype:{
        type: String,
        required: false
    },
    fortaxgonly:{
        type:Boolean,
        required: false
    },
    subtax:{
        type: [String],
        required: [false, 'please select your sub tax']
    }, 
    hsn:{
        type: Number,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Taxrate', taxrateSchema);