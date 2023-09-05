const Color = require('../../../model/modules/product/color');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Product = require('../../../model/modules/product/product');

// get All Colors => /api/colors
exports.getAllColors = catchAsyncErrors(async (req, res, next) => {
    let colors;
    try {
        colors = await Color.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!colors) {
        return next(new ErrorHandler('Color not found!', 404));
    }

    return res.status(200).json({
        colors
    });
})
// Create new Color => /api/color/new
exports.addColor = catchAsyncErrors(async (req, res, next) => {

    let acolor = await Color.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Signle Color => /api/color/:id
exports.getSingleColor = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let scolor = await Color.findById(id);

    if (!scolor) {
        return next(new ErrorHandler('Color not found!', 404));
    }
    return res.status(200).json({
        scolor
    })
})
// update Color by id => /api/color/:id
exports.updateColor = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ucolor = await Color.findByIdAndUpdate(id, req.body);

    if (!ucolor) {
        return next(new ErrorHandler('Color not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete Color by id => /api/color/:id
exports.deleteColor = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcolor = await Color.findByIdAndRemove(id);
    if (!dcolor) {
        return next(new ErrorHandler('Size not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.EditColorName = catchAsyncErrors(async (req, res, next) => {
    let colorname
    try {
        colorname = await Product.find({ assignbusinessid: req.body.assignbusinessid, color: req.body.colorname })

    } catch (err) {
        console.log(err.message);
    }

    if (!colorname) {
        return next(new ErrorHandler('colorname not found', 404));
    }
    return res.status(200).json({
        colorname
    });
})