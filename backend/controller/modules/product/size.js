const Size = require('../../../model/modules/product/size');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Product = require('../../../model/modules/product/product');
const Stock = require('../../../model/modules/product/stock');


// get All Sizes => /api/sizes
exports.getAllSizes = catchAsyncErrors(async (req, res, next) => {
    let sizes;
    try {
        sizes = await Size.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!sizes) {
        return next(new ErrorHandler('Size not found!', 404));
    }

    return res.status(200).json({
        sizes
    });
})

// get All Sizes => /api/sizes
exports.getAllSizesLimit = catchAsyncErrors(async (req, res, next) => {

    const { page = 1, limit = 1, sizename, sort, search } = req.query;

    const filters = {};
    if (sizename) {
        filters.sizename = sizename;
    }

    const query = Size.find(filters);

    if (search) {
        query.where({ name: { $regex: search, $options: 'i' } });
    }

    if (sort) {
        const [field, order] = sort.split(':');
        query.sort({ [field]: order === 'desc' ? -1 : 1 });
    }
    try {
        const items = await query.skip((page - 1) * limit).limit(+limit);
        const totalCount = await Size.countDocuments(filters);

        if (!items) {
            return next(new ErrorHandler('Data not found!', 404));
        }

        return res.status(200).json({
            items,
            totalPages: Math.ceil(totalCount / limit),
        });

    } catch (err) {
        console.log(err.message);
    }

})


// Create new Size => /api/size/new
exports.addSize = catchAsyncErrors(async (req, res, next) => {

    let asize = await Size.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!',
    });
})
// get Signle Size => /api/size/:id
exports.getSingleSize = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ssize = await Size.findById(id);

    if (!ssize) {
        return next(new ErrorHandler('Size not found!', 404));
    }
    return res.status(200).json({
        ssize
    })
})
// update Size by id => /api/size/:id
exports.updateSize = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let usize = await Size.findByIdAndUpdate(id, req.body);

    if (!usize) {
        return next(new ErrorHandler('Size not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete Unit by id => /api/unit/:id
exports.deleteSize = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dsize = await Size.findByIdAndRemove(id);

    if (!dsize) {
        return next(new ErrorHandler('Size not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})


exports.EditSizeName = catchAsyncErrors(async (req, res, next) => {
    let sizename, stock
    try {
        sizename = await Product.find({ assignbusinessid: req.body.businessid, size: req.body.sizename })
        stock = await Stock.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    size: req.body.sizename,
                }
            },
        })

    } catch (err) {
        console.log(err.message);
    }

    if (!sizename) {
        return next(new ErrorHandler('Size not found', 404));
    }
    return res.status(200).json({
        count: sizename.length + stock.length,
        sizename, stock
    });
})