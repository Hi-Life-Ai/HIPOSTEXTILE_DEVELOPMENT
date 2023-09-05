const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const assignedSchema = new Schema({
    username:{
        type: String,
        required: false,
    },
    assignbusinessid:{
        type: String,
        required: false
    },
    useruniqid:{
        type: String,
        required: false,
    },
    userid: [String],

    createdAt:{
        type: Date,
        default: Date.now
    },

})

module.exports = mongoose.model('Assigned', assignedSchema);