const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const purchaseSchema = new Schema({
    assignbusinessid: {
        type: String,
        required: false
    },
    supplier: {
        type: String,
        required: false
    },
    suppliershortname: {
        type: String,
        required: false
    },
    today: {
        type: String,
        required: false
    },
    referenceno: {
        type: String,
        required: false
    },
    userbyadd: {
        type: String,
        required: false
    },
    purchasedate: {
        type: String,
        required: false
    },
    purchasetaxmode: {
        type: String,
        required: false
    },
    purchasetaxlabmode: {
        type: String,
        required: false
    },
    discounttypemode: {
        type: String,
        required: false
    },
    discountvaluemode: {
        type: String,
        required: false
    },
    discountamountmode: {
        type: String,
        required: false
    },
    purchasestatus: {
        type: String,
        required: false
    },
    addressone: {
        type: String,
        required: false
    },
    billamount: {
        type: String,
        required: false
    },
    taxamount: {
        type: String,
        required: false
    },
    businesslocation: {
        type: String,
        required: false
    },
    invoiceno: {
        type: String,
        required: false
    },
    expenseamount: {
        type: String,
        required: false
    },
    freightamount: {
        type: String,
        required: false
    },
    totalamount: {
        type: String,
        required: false
    },
    totaltaxamount: {
        type: String,
        required: false
    },
    payterm: {
        type: String,
        required: false
    },
    paytermselect: {
        type: String,
        required: false
    },
    attachdoc: {
        type: String,
        required: false
    },
    purchaseorder: {
        type: String,
        required: false
    },
    overalltaxrate: {
        type: String,
        required: false
    },
    products: [
        {
            produniqid: {
                type: String,
                required: false
            },
            prodname: {
                type: String,
                required: false
            },
            supplier: {
                type: String,
                required: false
            },
            suppliershortname: {
                type: String,
                required: false
            },
            date: {
                type: String,
                required: false
            },
            sku: {
                type: String,
                required: false
            },
            hsn: {
                type: String,
                required: false
            },
            hsntax: {
                type: String,
                required: false
            },
            applicabletax: {
                type: String,
                required: false
            },
            applicabletaxrate: {
                type: String,
                required: false
            },
            lotnumber: {
                type: String,
                required: false
            },
            purchasetabletax: {
                type: String,
                required: false
            },
            purchasetax: {
                type: String,
                required: false
            },
            purchasetaxrate: {
                type: String,
                required: false
            },
            sellingpricetax: {
                type: String,
                required: false
            },
            enteramt: {
                type: String,
                required: false
            },
            margin: {
                type: String,
                required: false
            },
            purchaseexcludetax: {
                type: String,
                required: false
            },
            pruchaseincludetax: {
                type: String,
                required: false
            },
            excalpha: {
                type: String,
                required: false
            },
            incalpha: {
                type: String,
                required: false
            },
            quantity: {
                type: String,
                required: false
            },
            quantityunit: {
                type: String,
                required: false
            },
            quantitynitpiece: {
                type: String,
                required: false
            },
            quantitysubunitpieces: {
                type: String,
                required: false
            },
            quantitytotalpieces: {
                type: String,
                required: false
            },
            quantityunitstatus: {
                type: Boolean,
                required: false
            },
            freeitem: {
                type: String,
                required: false
            },
            freeitemunit: {
                type: String,
                required: false
            },
            freeitefreeitemtotalpiecesmunit: {
                type: String,
                required: false
            },
            freeitemtotalpieces: {
                type: String,
                required: false
            },
            freeitemunitstatus: {
                type: Boolean,
                required: false
            },
            freeitemnitpiece: {
                type: String,
                required: false
            },
            freeitemsubunitpieces: {
                type: String,
                required: false
            },
            netcostafterdiscount: {
                type: String,
                required: false
            },
            netcostbeforediscount: {
                type: String,
                required: false
            },
            netcosttaxamount: {
                type: String,
                required: false
            },
            netcostwithtax: {
                type: String,
                required: false
            },
            unitcostbeforediscount: {
                type: String,
                required: false
            },
            unitcostafterdiscount: {
                type: String,
                required: false
            },
            unitcosttaxamount: {
                type: String,
                required: false
            },
            unitcostwithtax: {
                type: String,
                required: false
            },
            purchasenetcost: {
                type: String,
                required: false
            },
            purchasenetcosttax: {
                type: String,
                required: false
            },
            purchasenetcostaftertax: {
                type: String,
                required: false
            },
            distypemod: {
                type: String,
                required: false
            },
            disvaluemod: {
                type: String,
                required: false
            },
            differenceamt: {
                type: String,
                required: false
            },
            ratebydismod: {
                type: String,
                required: false
            },
            sellingpriceunitcost: {
                type: String,
                required: false
            },
            sellingpriceunitwithoutcost: {
                type: String,
                required: false
            },
            saletaxamount: {
                type: String,
                required: false
            },

        }
    ],
    totalitem: {
        type: String,
        required: false
    },
    nettotal: {
        type: String,
        required: false
    },
    additionalnotes: {
        type: String,
        required: false
    },
    advancebalance: {
        type: String,
        required: false
    },
    payamount: {
        type: String,
        required: false
    },
    paidon: {
        type: String,
        required: false
    },
    paymentmethod: {
        type: String,
        required: false
    },
    paydue: {
        type: String,
        required: false
    },
    balance: {
        type: String,
        required: false
    },

    files: [
        {
            data: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            type: {
                type: String,
                required: false
            },
            preview: {
                type: String,
                required: false
            },
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Purchase', purchaseSchema);