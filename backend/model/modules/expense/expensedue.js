const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const expensedueSchema = new Schema ({
    expid:{
        type: String,
        required: false
    },
    dueamt:{
        type: String,
        required:false
    },
    date:{
        type: String,
        required: false
    },
    paymentmethod:{
        type: String,
        required: false
    },
    paymentaccount:{
        type: String,
        required: false
    },
    dueimg:{
        type: String,
        required: false
    },
    paymentnote:{
        type: String,
        required: false
    },
    payaccount:{
        type: String,
        required: false
    },
    paymethod:{
        type: String,
        required: false
    },
    payaccount:{
        type: String,
        required: false
    },
    cardnum:{
        type: String,
        required: false
    },
    cardhname:{
        type: String,
        required: false
    },
    cardtransnum:{
        type: String,
        required: false
    },
    cardtype:{
        type: String,
        required: false
    },
    month:{
        type: String,
        required: false
    },
    year:{
        type: String,
        required: false
    },
    securitycode:{
        type: String,
        required: false
    },
    checkno:{
        type: String,
        required: false
    },
    baccno:{
        type: String,
        required: false
    },
    transnum1:{
        type: String,
        required: false
    },
    transnum2:{
        type: String,
        required: false
    },
    transnum3:{
        type: String,
        required: false
    },
    transnum4:{
        type: String,
        required: false
    },
    transnum5:{
        type: String,
        required: false
    },
    transnum6:{
        type: String,
        required: false
    },
    transnum7:{
        type: String,
        required: false
    },
    paynotes:{
        type: String,
        required: false
    },
    payduecalc:{
        type: Number,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Expensedue', expensedueSchema)