const Stockajustment = require('../../../model/modules/stock/adjustment');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All adjustment => /api/stockajustment
exports.getAllStockAjustment = catchAsyncErrors(async (req, res, next) => {
    let stockadjustments

    try {
        stockadjustments = await Stockajustment.find({ assignbusinessid: req.body.businessid })
    } catch (error) {
        console.log(err.message);
    }
    if (!stockadjustments) {
        return next(new ErrorHandler('stockajustment not found', 404));
    }
    return res.status(200).json({
        stockadjustments
    });
})

//Adjustment quantity
exports.getAdjustmentQuantity = catchAsyncErrors(async (req, res, next) => {
    let allstocks;
    let result;
    let stockproducts = [];
    let dataallstocks = [];

    const query = {
        assignbusinessid: req.body.businessid,
        transferproducts: {
            $elemMatch: {
                sku: req.body.productid
            }
        }
    };

    try {
        result = await Stockajustment.find(query)
    } catch (error) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Data not found', 404));
    }
   //filter location role
   allstocks = result.filter((data,index)=>{
    if(req.body.role == 'Admin'){
        return data
    }else if(req.body.userassignedlocation.includes(data.businesslocation)){
        return data
      }
})

//filter products
dataallstocks = allstocks?.map((data,index)=>{
    return data.transferproducts
})
//individual products
dataallstocks.forEach((value)=>{
value.forEach((valueData)=>{
    if (req.body.productid == valueData.sku){
        stockproducts.push(valueData);
    }
})
})

return res.status(200).json({
    stockproducts
});
})

// Add new adjustment => /api/adjustment/new
exports.addStockAjustment = catchAsyncErrors(async (req, res, next) => {
    let astockadjustments = await Stockajustment.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });

})


//get single stockajustment by id => /api/adjustment/:id
exports.getSingleStockAjustment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;


    let sstockadjustments = await Stockajustment.findById(id)
    if (!sstockadjustments) {
        return next(new ErrorHandler('stockajustment not found', 404));
    }

    return res.status(200).json({
        sstockadjustments
    })

})

// update stockajustment by id =>/api/adjustment/:id
exports.updateStockAjustment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ustockadjustments = await Stockajustment.findByIdAndUpdate(id, req.body);

    if (!ustockadjustments) {
        return next(new ErrorHandler('stockajustment not found', 404));
    }

    return res.status(200).json({ message: 'Updates successfully' });
})


//delete adjustment => /api/adjustment/:id
exports.deleteStockAjustment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dstockadjustments = await Stockajustment.findByIdAndRemove(id);
    if (!dstockadjustments) {
        return next(new ErrorHandler('stockajustment not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

// check the value is already used for section delete
exports.getAllStockAjustmentSection = catchAsyncErrors(async (req, res, next) => {
    let stockadjust;

    try {
        stockadjust = await Stockajustment.find({ assignbusinessid: req.body.businessid, section: req.body.checksection })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!stockadjust) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        stockadjust
    });
})

// check the value is already used for stock adjust type delete
exports.getAllStockAjustmentType = catchAsyncErrors(async (req, res, next) => {
    let stockadjust;

    try {
        stockadjust = await Stockajustment.find({
            assignbusinessid: req.body.businessid,
            transferproducts: {
                $elemMatch: {
                    adjustmenttype: req.body.checkadjusttype,
                }
            },
        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!stockadjust) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        stockadjust
    });
})