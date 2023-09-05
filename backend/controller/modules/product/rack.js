const Rack = require('../../../model/modules/product/rack');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Product = require('../../../model/modules/product/product')

// get All Rack => /api/racks
exports.getAllRack = catchAsyncErrors(async (req, res, next) => {
    let racks;
    let result;
    try {
        result = await Rack.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Rack not found!', 404));
    }

    racks = result.filter((data, index) => {
        if (req.body.role == 'Admin') {
            return data
        } else if (req.body.userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })

    return res.status(200).json({
        racks
    });
})

exports.getAllCategorySubcategories = catchAsyncErrors(async (req, res, next) => {
    let result;
    let racks;
    let subracks = [];

    try {
        result = await Rack.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Rack not found!', 404));
    }

    racks = result.filter((data, index) => {
        if (req.body.role == 'Admin') {
            return data
        } else if (req.body.userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })

    //filter products
    let dataracks = racks.map((data, index) => {
        return data.combinerack
    })
    //individual products
    dataracks.forEach((value) => {
        value.forEach((valueData) => {
            subracks.push(valueData);
        })
    })

    return res.status(200).json({
        subracks
    });
})

// Create new Brand => /api/rack/new
exports.addRack = catchAsyncErrors(async (req, res, next) => {

    let arack = await Rack.create(req.body)

    return res.status(201).json({ message: 'Successfully added!' });
});

// get Signle Brand => /api/brand/:id
exports.getSingleRack = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let srack = await Rack.findById(id);


    if (!srack) {
        return next(new ErrorHandler('Rack not found!', 404));
    }
    return res.status(200).json({
        srack
    })
})

// update rack by id => /api/rack/:id
exports.updateRack = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let urack = await Rack.findByIdAndUpdate(id, req.body);

    if (!urack) {
        return next(new ErrorHandler('Rack not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete rack by id => /api/rack/:id
exports.deleteRack = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dRack = await Rack.findByIdAndRemove(id);

    if (!dRack) {
        return next(new ErrorHandler('Rack not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

// Edit rack start
exports.OverAllEditRack = catchAsyncErrors(async (req, res, next) => {
    let products
    try {
        products = await Product.find({ assignbusinessid: req.body.businessid, rack: req.body.rack })
    } catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Data not found', 404));
    }
    return res.status(200).json({
        count: products.length,
        products
    });
}) 