const Adjustment = require('../../../model/modules/stock/adjustmenttype');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Stockajustment =  require('../../../model/modules/stock/adjustment');

// get All adjustment => /api/adjustments
exports.getAllAdjustment = catchAsyncErrors(async (req, res, next) => {
    let adjustments

    try {
        adjustments = await Adjustment.find({ assignbusinessid: req.body.businessid })
    } catch (error) {
        console.log(err.message);
    }
    if (!adjustments) {
        return next(new ErrorHandler('adjustment not found', 404));
    }
    return res.status(200).json({
        adjustments
    });
})

// Add new adjustment => /api/adjustment/new
exports.addAdjustment = catchAsyncErrors(async (req, res, next) => {

    let aadjustment = await Adjustment.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });

})


//get single Adjustment by id => /api/adjustment/:id
exports.getSingleAdjustment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;


    let sadjustment = await Adjustment.findById(id)
    if (!sadjustment) {
        return next(new ErrorHandler('Adjustment not found', 404));
    }

    return res.status(200).json({
        sadjustment
    })

})

// update Adjustment by id =>/api/adjustment/:id
exports.updateAdjustment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uadjustment = await Adjustment.findByIdAndUpdate(id, req.body);

    if (!uadjustment) {
        return next(new ErrorHandler('Adjustment not found', 404));
    }

    return res.status(200).json({ message: 'Updates successfully' });
})


//delete adjustment => /api/adjustment/:id
exports.deleteAdjustment = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dadjustment = await Adjustment.findByIdAndRemove(id);

    if (!dadjustment) {
        return next(new ErrorHandler('Adjustment not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

//Adjust type update
// product edit function for stock adjustment
exports.overAllEditAdjustType = catchAsyncErrors(async (req, res, next) => {
    let adjustmenttype

    try {
        adjustmenttype = await Stockajustment.find({
            assignbusinessid: req.body.businessid,
            transferproducts: {
                $elemMatch: {
                    adjustmenttype: req.body.adjustmenttype,
                }
            },
        })
    } catch (err) {
        console.log(err.message);
    }

    if (!adjustmenttype) {
        return next(new ErrorHandler('Product not found', 404));
    }
    return res.status(200).json({
        count: adjustmenttype.length,
        adjustmenttype
    });
})