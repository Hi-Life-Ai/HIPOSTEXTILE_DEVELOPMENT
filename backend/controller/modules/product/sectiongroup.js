const Section = require('../../../model/modules/product/sectiongroup');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Stockajustment = require('../../../model/modules/stock/adjustment');

// get All sectiongoups => /api/sectiongoups
exports.getAllSectionGroup = catchAsyncErrors(async (req, res, next) => {
    let sectiongoups

    try {
        sectiongoups = await Section.find({ assignbusinessid: req.body.businessid })
    } catch (error) {
        console.log(err.message);
    }
    if (!sectiongoups) {
        return next(new ErrorHandler('Section not found', 404));
    }
    return res.status(200).json({
        sectiongoups
    });
})

// Add new sectiongroup => /api/sectiongroup/new
exports.addSectionGroup = catchAsyncErrors(async (req, res, next) => {

    let asectiongroup = await Section.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });

})


//get single Section by id => /api/sectiongroup/:id
exports.getSingleSectionGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;


    let ssectiongroup = await Section.findById(id)
    if (!ssectiongroup) {
        return next(new ErrorHandler('Section not found', 404));
    }

    return res.status(200).json({
        ssectiongroup
    })

})

// update Section by id =>/api/sectiongroup/:id
exports.updateSectionGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let usectiongroup = await Section.findByIdAndUpdate(id, req.body);

    if (!usectiongroup) {
        return next(new ErrorHandler('Section not found', 404));
    }

    return res.status(200).json({ message: 'Updates successfully' });
})


//delete sectiongroup => /api/sectiongroup/:id
exports.deleteSectionGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dsectiongroup = await Section.findByIdAndRemove(id);

    if (!dsectiongroup) {
        return next(new ErrorHandler('Section not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

// check the value is already used for category delete
exports.getAllSectionGroupCategory = catchAsyncErrors(async (req, res, next) => {
    let sectiongroups;

    try {
        sectiongroups = await Section.find({
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
    if (!sectiongroups) {
        return next(new ErrorHandler('Section Group not found!', 404));
    }

    return res.status(200).json({
        sectiongroups
    });
})

//section update
// section edit function for stock adjust
exports.overAllEditSection = catchAsyncErrors(async (req, res, next) => {
    let stockadjusts

    try {
        stockadjusts = await Stockajustment.find({
            assignbusinessid: req.body.businessid, section: req.body.sectionname
        })
    } catch (err) {
        console.log(err.message);
    }

    if (!stockadjusts) {
        return next(new ErrorHandler('Stock not found', 404));
    }
    return res.status(200).json({
        count: stockadjusts.length,
        stockadjusts
    });
})