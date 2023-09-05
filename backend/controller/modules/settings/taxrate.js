const Taxrate = require('../../../model/modules/settings/taxrate');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Product = require('../../../model/modules/product/product')
const Purchase = require('../../../model/modules/purchase/purchase')
const PurchaseRtn = require('../../../model/modules/purchase/purchasereturn')
const Expense = require('../../../model/modules/expense/expense')
const Draft = require('../../../model/modules/sell/draft')
const Quotation = require('../../../model/modules/sell/quoation')

// get All Taxrate => /api/taxratesall
exports.getAllTaxrate = catchAsyncErrors(async (req, res, next) => {
    let taxrates;

    try{
        taxrates = await Taxrate.find({assignbusinessid: req.body.businessid, taxtype: 'taxrate'})
    }catch(err){
        console.log(err.message);
    }

    if(!taxrates){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        count:taxrates.length,
        taxrates
    });
})

exports.getAllTaxrateForgroupfalse = catchAsyncErrors(async (req, res, next) => {
    let taxratesforgroupfalse;

    try{
        taxratesforgroupfalse = await Taxrate.find({assignbusinessid: req.body.businessid, taxtype: 'taxrate', fortaxgonly:false})
    }catch(err){
        console.log(err.message);
    }

    if(!taxratesforgroupfalse){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        count:taxratesforgroupfalse.length,
        taxratesforgroupfalse
    });
})

// // get All Taxrate HSN => /api/taxrateshsn
exports.getAllTaxrateHsn = catchAsyncErrors(async (req, res, next) => {
    let taxrateshsn;

    try{
        taxrateshsn = await Taxrate.find({assignbusinessid: req.body.businessid, taxtype: 'hsn'})
    }catch(err){
        console.log(err.message);
    }

    if(!taxrateshsn){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        count:taxrateshsn.length,
        taxrateshsn
    });
})

exports.getAllTaxrateGroupForgroupfalse = catchAsyncErrors(async (req, res, next) => {
    let taxratesgroupforgroupfalse;

    try{
        taxratesgroupforgroupfalse = await Taxrate.find(
            {$or:
                [
                {assignbusinessid: req.body.businessid, taxtype: 'taxrate', fortaxgonly:false},
                {assignbusinessid: req.body.businessid, taxtype:'taxrategroup', fortaxgonly:false},
                {assignbusinessid: req.body.businessid, taxtype:'hsn'}
            ]})
    }catch(err){
        console.log(err.message);
    }

    if(!taxratesgroupforgroupfalse){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        count:taxratesgroupforgroupfalse.length,
        taxratesgroupforgroupfalse
    });
})

//Tax group and taxrate
exports.getAllTaxrateGroup = catchAsyncErrors(async (req, res, next) => {
    let taxratesgroup;

    try{
        taxratesgroup = await Taxrate.find({assignbusinessid: req.body.businessid, taxtype: 'taxrategroup'})
    }catch(err){
        console.log(err.message);
    }

    if(!taxratesgroup){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        count:taxratesgroup.length,
        taxratesgroup
    });
})

exports.getAllTaxrateGrouphsnForgroupfalse = catchAsyncErrors(async (req, res, next) => {
    let taxratesforgrouphsnfalse;

    try{
        taxratesforgrouphsnfalse = await Taxrate.find({$or:[{assignbusinessid: req.body.businessid, taxtype: 'taxrate', fortaxgonly:false},{assignbusinessid: req.body.businessid, taxtype: 'taxrategroup', fortaxgonly:false},{assignbusinessid: req.body.businessid, taxtype: 'hsn'}]})
    }catch(err){
        console.log(err.message);
    }

    if(!taxratesforgrouphsnfalse){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        count:taxratesforgrouphsnfalse.length,
        taxratesforgrouphsnfalse
    });
})


// Create new Taxrate => /api/taxrate/new
exports.addTaxrate = catchAsyncErrors(async (req, res, next) =>{
   
    let ataxrate = await Taxrate.create(req.body);

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})

// get Signle Taxrate => /api/taxrate/:id
exports.getSingleTaxrate = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let staxrate = await Taxrate.findById(id);

    if(!staxrate){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        staxrate
    })
})

// update Taxrate by id => /api/taxrate/:id
exports.updateTaxrate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uptaxrate = await Taxrate.findByIdAndUpdate(id, req.body);

    if (!uptaxrate) {
      return next(new ErrorHandler('Taxrate not found!', 400));
    }

    return res.status(200).json({
        message: 'Updated successfully' 
    });
})

// delete Taxrate by id => /api/taxrate/:id
exports.deleteTaxrate = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dtaxrate = await Taxrate.findByIdAndRemove(id);


    if(!dtaxrate){
        return next(new ErrorHandler('Taxrate not found!', 400));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})

// tax edit function for product, purchase, purchase return, expense, draft and quotation
exports.overAllEditTax = catchAsyncErrors(async (req, res, next) => {
    let product, purchase, purchasereturn, expense, draft, quotation;
    console.log(req.body.tax);
    try {
        product = await Product.find({ assignbusinessid: req.body.businessid, applicabletax: req.body.tax })
        purchase = await Purchase.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    purchasetax: req.body.tax,
                }
            },
        })
        purchasereturn = await PurchaseRtn.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    purchasetax: req.body.tax,
                }
            },
        })
        expense = await Expense.find({ assignbusinessid: req.body.businessid, exptax: req.body.tax })
        draft = await Draft.find({
            assignbusinessid: req.body.businessid,
            goods: {
                $elemMatch: {
                    applicabletax: req.body.tax,
                }
            },
        })
        quotation = await Quotation.find({
            assignbusinessid: req.body.businessid,
            goods: {
                $elemMatch: {
                    applicabletax: req.body.tax,
                }
            },
        })
    } catch (err) {
        console.log(err.message);
    }

    if (!product) {
        return next(new ErrorHandler('Taxrate not found', 404));
    }
    return res.status(200).json({
        count: product.length + purchase.length + purchasereturn.length + expense.length + draft.length + quotation.length,
        product, purchase, purchasereturn, expense, draft, quotation
    });
})