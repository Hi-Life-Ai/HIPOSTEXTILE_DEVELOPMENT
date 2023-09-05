const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const barandSchema = new Schema({
    brandname:{
        type: String,
        required: false
    },
    brandcode:{
        type: String,
        required: false
    },
    brandshortname:{
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
  
    subbrands:[{
        subbrandname:{
            type: String,
            required: false
        },
        subbrandcode:{
            type: String,
            required: false
        },
        subbrandshotname:{
            type: String,
            required: false
        },
    }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('Brand', barandSchema);