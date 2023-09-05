const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({

    contacttype:{
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    individual:{
        type:Boolean,
        required: false
    },
    business:{
        type:Boolean,
        required: false
    },
    contactid:{
        type: String,
        required: false
    },
    customergroup:{
        type: String,
        required: false
    },
    businessname:{
        type: String,
        required: false
    },
    firstname:{
        type: String,
        required: false
    },

    lastname:{
        type: String,
        required: false
    },
    phonenumber:{
        type: Number,
        required: false,
        maxLength:[10, 'Cannot mobile number more 10 characters']
    },
    email:{
        type: String,
        required: false
    },
    taxnumber:{
        type: String,
        required: false
    },
    openbalance:{
        type: Number,
        required: false
    },

    payterm:{
        type: Number,
        required: false
    },
    paytermassign:{
        type: String,
        required: false
    },
    creditlimit:{
        type: Number,
        required: false
    },
    addressone:{
        type: String,
        required: false
    },
    addresstwo:{
        type: String,
        required: false
    },
     city:{
        type: String,
        required: false
    },
    state:{
        type: String,
        required: false
    },
    country:{
        type: String,
        required: false
    },
    zipcode:{
        type: String,
        required: false
    },
    shippingadd:{
        type: String,
        required: false
    },
    activate:{
        type:Boolean,
        required: false
    },
    whatsappno:{
        type:Number,
        required :false
    },
    contactperson:{
        type:String,
        required :false
    },
    gstno:{
        type:String,
        required:false
    },
    ledgerbalance:{
        type:Number,
        required:false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Customer', customerSchema);