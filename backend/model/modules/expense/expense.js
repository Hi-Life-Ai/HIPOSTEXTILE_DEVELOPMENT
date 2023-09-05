const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const expenseSchema = new Schema ({
    businesslocation:{
        type: String,
        required: false
    },
    expcategory:{
        type: String,
        required: false
    },
    today:{
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    referenceno:{
        type: String,
        required: false
    },
    expdate:{
        type: String,
        required: false
    },
    expimage:{
        type: String,
        required: false
    },
    exptax:{
        type: String,
        required: false
    },
    totalamount:{
        type: String,
        required: false
    },
    expnote:{
        type: String,
        required: false
    },
    expamount:{
        type: String,
        required: false
    },
    exppaidon:{
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
    paydue:{
        type: String,
        required: false
    },
    duppaydue:{
        type: String,
        required: false
    },
    files:[
        {
    data: {
        type: String,
        required: false
    },
    name:{
        type: String,
        required: false
    },
    preview: {
        type: String,
        required: false
    },
        }
    ],
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Expense', expenseSchema);