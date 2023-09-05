const Purchase = require('../../../model/modules/purchase/purchase');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const moment = require('moment');
//  Datefield
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;

// get All Purchases => /api/purchases
exports.getAllPurchases = catchAsyncErrors(async (req, res, next) => {
    let purchases;
    let result;

    try{
        result = await Purchase.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Purchase not found!', 404));
    }

    purchases = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        purchases
    });
})

// get All Purchases => /api/purchases
exports.getAllPurchasesList = catchAsyncErrors(async (req, res, next) => {
    let purchases;
    let result;

    try{
        result = await Purchase.find({assignbusinessid: req.body.businessid},{purchasedate:1,referenceno:1,assignbusinessid:1,businesslocation:1,supplier:1,billamount:1,invoiceno:1,purchasestatus:1,paymentmethod:1,paydue:1,userbyadd:1,payamount:1,nettotal:1,totalamount:1,files:1})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Purchase not found!', 404));
    }

    purchases = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        purchases
    });
})

// get All Purchasesstocks => /api/purchasesstocks
exports.getAllPurchasesStockAdjustmeProducts = catchAsyncErrors(async (req, res, next) => {
    let purchases;
    let result;
    let purchasesproducts = [];

    const query = {
        assignbusinessid: req.body.businessid,
        purchasestatus:"Received",
        products: {
            $elemMatch: {
                sku: req.body.productid
            }
        }
    };

    try{
        result = await Purchase.find(query);

        if(!result){
            return next(new ErrorHandler('Data not found!', 404));
        }

        //filter location role
    purchases = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    //filter products
    let datapurchases = purchases?.map((data,index)=>{
        return data.products
    })
    //individual products
    datapurchases?.forEach((value)=>{
    value?.forEach((valueData)=>{
        if (req?.body?.productid == valueData?.sku){
        purchasesproducts.push(valueData);
        }
    })
    })

    return res.status(200).json({
        result,
        datapurchases,
        purchasesproducts
    });
    }catch(err){
        console.log(err.message);
    }
    
})

// get All Purchasesstocks => /api/purchasesstocks
exports.getAllPurchasesStock = catchAsyncErrors(async (req, res, next) => {
    let purchases;
    let result;
    let purchasesproducts = [];

    const query = {
        assignbusinessid: req.body.businessid,
        purchasestatus: "Received",
        products: {
            $elemMatch: {
                sku: req.body.productid
            }
        }
    };

    try{
        result = await Purchase.find(query);

        if(!result){
            return next(new ErrorHandler('Data not found!', 404));
        }
    
        //filter location role
        purchases = result.filter((data,index)=>{
            if(req.body.role == 'Admin'){
                return data
            }else if(req.body.userassignedlocation.includes(data.businesslocation)){
              return data
            }
        })
    
        //filter products
        let datapurchases = purchases?.map((data,index)=>{
            return data.products
        })
        //individual products
        datapurchases.forEach((value)=>{
        value.forEach((valueData)=>{
            if (req.body.productid == valueData.sku){
            purchasesproducts.push(valueData);
            }
        })
        })
    
        return res.status(200).json({
            purchasesproducts
        });
    }catch(err){
        console.log(err.message);
    }
    
})

exports.getAllTotalPurchases = catchAsyncErrors(async (req, res, next) => {

    const { startdate, enddate, islocation, location } = req.body

    let purchaseall;
    let result;
    try {
        result = await Purchase.find({ assignbusinessid: req.body.businessid,today: { $gte: startdate, $lte: enddate }})
        resultlocation = await Purchase.find({ assignbusinessid: req.body.businessid,businesslocation: location,today: { $gte: startdate, $lte: enddate }})
    
        if (!result) {
            return next(new ErrorHandler('Data not found!', 404));
        }
    
        purchaseall = islocation ? resultlocation : result
        return res.status(200).json({
            purchaseall
        });

    } catch (err) {
        console.log(err.message);
    }
})

exports.getWeeklyPurchase = catchAsyncErrors(async (req, res, next) => {

    const previousWeekDates = [];
    const currentDate = new Date();
    for (let i = 1; i <= 7; i++) {
        const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 + i);
        previousWeekDates.push(moment(previousDate).utc().format('YYYY-MM-DD'));
    }
    const { businessid, islocation, location } = req.body

    let result;
    let resultlocation
    let weeklyreport
    try {
        result = await Purchase.find({ assignbusinessid: businessid, today: { $in: previousWeekDates } });
        resultlocation = await Purchase.find({ assignbusinessid: businessid, businesslocation: location, today: { $in: previousWeekDates } });

    } catch (err) {
        console.log(err.message);
    }

    weeklyreport = islocation ? resultlocation : result

    return res.status(200).json({
        weeklyreport
    });
})


// get All sales today => /api/products
exports.getAllTodayPurchase = catchAsyncErrors(async (req, res, next) => {
    let todaypurchase;
    let result;
    try{
        result = await Purchase.find({assignbusinessid: req.body.businessid,today:today})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Data not found!', 404));
    }
    
    todaypurchase = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })
    
    return res.status(200).json({
        todaypurchase
    });
})

//get All purchase reference No
exports.getAllIndexPurchase = catchAsyncErrors(async (req, res, next) => {
    let purchases;
    try{
        purchases = await Purchase.find({assignbusinessid: req.body.businessid},{referenceno:1})
    }catch(err){
        console.log(err.message);
    }
    if(!purchases){
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({
        purchases
    });
})

// Create new purchase => /api/purchase/new
exports.addPurchase = catchAsyncErrors(async (req, res, next) =>{
   
    let apurchase = await Purchase.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
 
})

// get Signle purchase => /api/purchase/:id
exports.getSinglePurchase = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let spurchse = await Purchase.findById(id);

    if(!spurchse){
        return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({
        spurchse
    })
})

// update purchase by id => /api/purchase/:id
exports.updatePurchase = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upurchase = await Purchase.findByIdAndUpdate(id, req.body);

    if (!upurchase) {
      return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });

})

// delete purchase by id => /api/purchase/:id
exports.deletePurchase = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dpurchase = await Purchase.findByIdAndRemove(id);

    if(!dpurchase){
        return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})

// check the value is already used for supplier delete
exports.getAllPurchaseSupplier = catchAsyncErrors(async (req, res, next) => {
    let purchases;

    try {
        purchases = await Purchase.find({ assignbusinessid: req.body.businessid, supplier: req.body.checksupplier, })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!purchases) {
        return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({
        purchases
    });
})

// check the value is already used for location delete
exports.getAllPurchaseLocation = catchAsyncErrors(async (req, res, next) => {
    let purchases;

    try {
        purchases = await Purchase.find({ assignbusinessid: req.body.businessid, businesslocation: req.body.checklocationid })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!purchases) {
        return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({
        purchases
    });
})

// check the value is already used for unit delete
exports.getAllPurchaseUnit = catchAsyncErrors(async (req, res, next) => {
    let purchases;

    try {
        purchases = await Purchase.find({ assignbusinessid: req.body.businessid, quantityunit: req.body.checkquantityunit, freeitemunit: req.body.checkfreeitemunit })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!purchases) {
        return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({
        purchases
    });
})

// check the value is already used for product delete
exports.getAllPurchaseProduct = catchAsyncErrors(async (req, res, next) => {
    let purchases;

    try {
        purchases = await Purchase.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    sku: req.body.checksku,
                }
            },
        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!purchases) {
        return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({
        purchases
    });
})

// check the value is already used for taxrate delete
exports.getAllPurchaseTaxrate = catchAsyncErrors(async (req, res, next) => {
    let purchases;

    try {
        purchases = await Purchase.find({
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
    if (!purchases) {
        return next(new ErrorHandler('Purchase not found!', 404));
    }

    return res.status(200).json({
        purchases
    });
})
