const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sectiongroupSchema = new Schema({
    assignbusinessid: {
        type: String,
        required: false
    },
    sectionname: {
        type: String,
        required: false
    },
    categories: [
        {
            categoryname: {
                type: String,
                required: false
            },
            subcategories: [
                {
                    subcategryname: {
                        type: String,
                        required: false
                    },
                }
            ],
        }],
    createdAt: {
        type: Date,
        default: Date.now
    },
})
module.exports = mongoose.model('SectionGroup', sectiongroupSchema);