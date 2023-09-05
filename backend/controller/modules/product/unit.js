const Unit = require('../../../model/modules/product/unit');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const UnitGrouping = require('../../../model/modules/product/unitgroup');
const Purchase = require('../../../model/modules/purchase/purchase');
const Product = require('../../../model/modules/product/product');

// get All Units => /api/units
exports.getAllUnits = catchAsyncErrors(async (req, res, next) => {
    let units;
    try {
        units = await Unit.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!units) {
        return next(new ErrorHandler('Unit not found!', 404));
    }

    return res.status(200).json({
        units
    });
})
// Create new Unit => /api/unit/new
exports.addUnit = catchAsyncErrors(async (req, res, next) => {

    let aunit = await Unit.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Signle Unit => /api/unit/:id
exports.getSingleUnit = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sunit = await Unit.findById(id);

    if (!sunit) {
        return next(new ErrorHandler('Unit not found!', 404));
    }
    return res.status(200).json({
        sunit
    })
})
// update Unit by id => /api/unit/:id
exports.updateUnit = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uunit = await Unit.findByIdAndUpdate(id, req.body);

    if (!uunit) {
        return next(new ErrorHandler('Unit not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete Unit by id => /api/unit/:id
exports.deleteUnit = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dunit = await Unit.findByIdAndRemove(id);

    if (!dunit) {
        return next(new ErrorHandler('Unit not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

// check the value is already used for unit delete
exports.getAllUnitGroupingUnit = catchAsyncErrors(async (req, res, next) => {
    let unitgroupings;

    try {
        unitgroupings = await UnitGrouping.find({ assignbusinessid: req.body.businessid, unit: req.body.checkunit })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!unitgroupings) {
        return next(new ErrorHandler('Purchase not found!', 404));
    }
    return res.status(200).json({
        unitgroupings
    });
})


exports.getAllUnitEdit = catchAsyncErrors(async (req, res, next) => {
    let unitgroup, purchase , productunit
    const query = {
        products: {
            $elemMatch: {
                quantityunit: req.body.unit,
                assignbusinessid: req.body.businessid,
            }
        }
    };
    try {
        productunit = await Product.find({ unit: req.body.unit });
        unitgroup = await UnitGrouping.find({ unit: req.body.unit, assignbusinessid: req.body.businessid })
        purchase = await Purchase.find(query)
    } catch (err) {
        console.log(err.message);
    }
    if (!unitgroup) {
        return next(new ErrorHandler('Unit not found!', 404));
    }
    return res.status(200).json({
        productunit,  unitgroup, purchase, count: unitgroup.length + purchase.length + productunit.length
    });
})