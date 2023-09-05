const ManualStock = require('../../../model/modules/stock/manualstockentry');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All ManualStockentry => /api/manualstockentrys
exports.getAllManualstockentry = catchAsyncErrors(async (req, res, next) => {
    let manualstocks

    try {
        manualstocks = await ManualStock.find({ assignbusinessid: req.body.businessid })
    } catch (error) {
        console.log(err.message);
    }
    if (!manualstocks) {
        return next(new ErrorHandler('ManualStock not found', 404));
    }
    return res.status(200).json({
        manualstocks
    });
})

// Add new Manualstockentry => /api/manualstock/new
exports.addManualstock = catchAsyncErrors(async (req, res, next) => {

    let amanualstock = await ManualStock.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });

})


//get single ManualStock by id => /api/manualstock/:id
exports.getSingleManualStock = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;


    let smanualstock = await ManualStock.findById(id)
    if (!smanualstock) {
        return next(new ErrorHandler('ManualStock not found', 404));
    }

    return res.status(200).json({
        smanualstock
    })

})

// update ManualStock by id =>/api/manualstock/:id
exports.updateManualstock = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let umanualstock = await ManualStock.findByIdAndUpdate(id, req.body);

    if (!umanualstock) {
        return next(new ErrorHandler('ManualStock not found', 404));
    }

    return res.status(200).json({ message: 'Updates successfully' });
})


//delete Manualstock => /api/manualstock/:id
exports.deleteManualstock = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dmanualstock = await ManualStock.findByIdAndRemove(id);

    if (!dmanualstock) {
        return next(new ErrorHandler('ManualStock not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})