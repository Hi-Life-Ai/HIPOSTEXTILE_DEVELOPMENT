const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const expcatSchema = new Schema ({

    categoryname:{
        type: String,
        required: false
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    categorycode:{
        type: String,
        required: false
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
    
})

module.exports = mongoose.model('Expcategory', expcatSchema);