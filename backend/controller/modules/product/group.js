const Group = require('../../../model/modules/product/group');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All groups => /api/groups
exports.getAllGroup = catchAsyncErrors(async (req, res, next) => {
    let groups

    try {
        groups = await Group.find({ assignbusinessid: req.body.businessid })
    } catch (error) {
        console.log(err.message);
    }
    if (!groups) {
        return next(new ErrorHandler('Group not found', 404));
    }
    return res.status(200).json({
        groups
    });
})

// Add new group => /api/addgroup/new
exports.addGroup = catchAsyncErrors(async (req, res, next) => {

    let agroup = await Group.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });

})


//get single Group by id => /api/group/:id
exports.getSingleGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;


    let sgroup = await Group.findById(id)
    if (!sgroup) {
        return next(new ErrorHandler('Group not found', 404));
    }

    return res.status(200).json({
        sgroup
    })

})

// update Group by id =>/api/group/:id
exports.updateGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ugroup = await Group.findByIdAndUpdate(id, req.body);

    if (!ugroup) {
        return next(new ErrorHandler('Group not found', 404));
    }

    return res.status(200).json({ message: 'Updates successfully' });
})


//delete group => /api/group/:id
exports.deleteGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dgroup = await Group.findByIdAndRemove(id);

    if (!dgroup) {
        return next(new ErrorHandler('Group not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

// check the value is already used for brand delete
exports.getAllGroupBrand = catchAsyncErrors(async (req, res, next) => {
    let groups;

    try {
        groups = await Group.find({ assignbusinessid: req.body.businessid, brandname: req.body.checkbrand })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!groups) {
        return next(new ErrorHandler('Group not found!', 404));
    }

    return res.status(200).json({
        groups
    });
})

// check the value is already used for category delete
exports.getAllGroupCategory = catchAsyncErrors(async (req, res, next) => {
    let groups;

    try {
        groups = await Group.find({
            assignbusinessid: req.body.businessid,
            categories: {
                $elemMatch: {
                    categoryname: req.body.checkcategory,
                }
            },
        })
    }

    catch (err) {
        console.log(err.message);
    }
    if (!groups) {
        return next(new ErrorHandler('Group not found!', 404));
    }

    return res.status(200).json({
        groups
    });
})