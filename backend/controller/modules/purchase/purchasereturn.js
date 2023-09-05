const Purchasereturn = require('../../../model/modules/purchase/purchasereturn');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const moment = require('moment');
//  Datefield
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
// get All Brands => /api/brands
exports.getAllPurchasesrtn = catchAsyncErrors(async (req, res, next) => {
    let purchasesrtn;
    let result;
    
    try{
        result = await Purchasereturn.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Purchase Return not found!', 404));
    }

    purchasesrtn = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        purchasesrtn
    });
})

exports.getTotalPurchasertn = catchAsyncErrors(async (req, res, next) => {
    const { startdate, enddate, islocation, location } = req.body

    let purchasertnall;
    let result;
    try {
        result = await Purchasereturn.find({ assignbusinessid: req.body.businessid,today: { $gte: startdate, $lte: enddate }})
        resultlocation = await Purchasereturn.find({ assignbusinessid: req.body.businessid,businesslocation: location,today: { $gte: startdate, $lte: enddate }})
    
        if (!result) {
            return next(new ErrorHandler('Data not found!', 404));
        }
    
        purchasertnall = islocation ? resultlocation : result
        return res.status(200).json({
            purchasertnall
        });
        
    } catch (err) {
        console.log(err.message);
    }
})

// get All sales today => /api/products
exports.getAllTodayPurchasertn = catchAsyncErrors(async (req, res, next) => {
    let todaypurchasertn;
    let result;
    try{
        result = await Purchasereturn.find({assignbusinessid: req.body.businessid,today:today})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Data not found!', 404));
    }
    
    todaypurchasertn = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })
    
    return res.status(200).json({
        todaypurchasertn
    });
})

// Create new Brand => /api/brand/new
exports.addPurchasereturn = catchAsyncErrors(async (req, res, next) =>{
   let apurchasertn = await Purchasereturn.create(req.body)

   return res.status(200).json({ 
    message: 'Successfully added!' 
});
})
// get Signle Brand => /api/brand/:id
exports.getSinglePurchasereturn =catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let spurchsertn = await Purchasereturn.findById(id);

    if(!spurchsertn){
        return next(new ErrorHandler('Purchase Return not found!', 404));
    }
    return res.status(200).json({
        spurchsertn
    })
})
// update Brand by id => /api/brand/:id
exports.updatePurchasereturn = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upurchasertn = await Purchasereturn.findByIdAndUpdate(id, req.body);

    if (!upurchasertn) {
      return next(new ErrorHandler('Purchase Return not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete brand by id => /api/brand/:id
exports.deletePurchasereturn = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dpurchasertn = await Purchasereturn.findByIdAndRemove(id);

    if(!dpurchasertn){
        return next(new ErrorHandler('Purchase Return not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})
// check the value is already used for supplier delete
exports.getAllPurchaseRtnSupplier = catchAsyncErrors(async (req, res, next) => {
    let purchasesrtn;
    try {
        purchasesrtn = await Purchasereturn.find({assignbusinessid: req.body.businessid, supplier: req.body.checksupplier,})        
    }
    catch (err) {
        console.log(err.message);
    }
    if (!purchasesrtn) {
        return next(new ErrorHandler('Purchase Return not found!', 404));
    }
    return res.status(200).json({
        purchasesrtn
    });
})

// check the value is already used for location delete
exports.getAllPurchaseRtnLocation = catchAsyncErrors(async (req, res, next) => {
    let purchasesrtn;

    try {
        purchasesrtn = await Purchasereturn.find({assignbusinessid: req.body.businessid, businesslocation: req.body.checklocationid })        
    }
    catch (err) {
        console.log(err.message);
    }
    if (!purchasesrtn) {
        return next(new ErrorHandler('Purchase Return not found!', 404));
    }
    return res.status(200).json({
        purchasesrtn
    });
})

// check the value is already used for unit delete
exports.getAllPurchaseRtnUnit = catchAsyncErrors(async (req, res, next) => {
    let purchasesrtn;

    try {
        purchasesrtn = await Purchasereturn.find({assignbusinessid: req.body.businessid, quantityunit: req.body.checkquantityunit, freeitemunit: req.body.checkfreeitemunit})        
    }
    catch (err) {
        console.log(err.message);
    }
    if (!purchasesrtn) {
        return next(new ErrorHandler('Purchase Return not found!', 404));
    }
    return res.status(200).json({
        purchasesrtn
    });
})

// check the value is already used for product delete
exports.getAllPurchaseRtnProduct = catchAsyncErrors(async (req, res, next) => {
    let purchasesrtn;

    try {
        purchasesrtn = await Purchasereturn.find({assignbusinessid: req.body.businessid, sku: req.body.checksku})        
    }
    catch (err) {
        console.log(err.message);
    }
    if (!purchasesrtn) {
        return next(new ErrorHandler('Purchase Return not found!', 404));
    }
    return res.status(200).json({
        purchasesrtn
    });
})

// check the value is already used for taxrate delete
exports.getAllPurchaseRtnTaxrate = catchAsyncErrors(async (req, res, next) => {
    let purchasesrtn;

    try {
        purchasesrtn = await Purchasereturn.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    $or: [
                        { purchasetax: req.body.checktaxrates },
                        { purchasetax: req.body.checkhsn },
                    ]
                }
            },

        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!purchasesrtn) {
        return next(new ErrorHandler('Purchase Return not found!', 404));
    }

    return res.status(200).json({
        purchasesrtn
    });
})
