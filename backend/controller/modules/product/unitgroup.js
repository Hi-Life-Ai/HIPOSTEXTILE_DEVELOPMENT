const UnitGrouping = require('../../../model/modules/product/unitgroup');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Units => /api/unitgroupings
exports.getAllUnitGrouping = catchAsyncErrors(async (req, res, next) => {
    let unitgroupings;
    try{
        unitgroupings = await UnitGrouping.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }
    if(!unitgroupings){
        return next(new ErrorHandler('UnitGrouping not found!', 404));
    }

    return res.status(200).json({
        unitgroupings
    });
})
// Create new UnitGrouping => /api/unitgroup/new
exports.addUnitGrouping = catchAsyncErrors(async (req, res, next) =>{
    
    let aunitgrouping = await UnitGrouping.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Signle UnitGrouping => /api/unitgroup/:id
exports.getSingleUnitGrouping = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sunitgrouping = await UnitGrouping.findById(id);

    if(!sunitgrouping){
        return next(new ErrorHandler('UnitGrouping not found!', 404));
    }
    return res.status(200).json({
        sunitgrouping
    })
})
// update UnitGrouping by id => /api/unitgroup/:id
exports.updateUnitGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uunitgrouping = await UnitGrouping.findByIdAndUpdate(id, req.body);

    if (!uunitgrouping) {
      return next(new ErrorHandler('UnitGrouping not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})
// delete UnitGrouping by id => /api/unitgroup/:id
exports.deleteUnitGrouping = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dunitgrouping = await UnitGrouping.findByIdAndRemove(id);

    if(!dunitgrouping){
        return next(new ErrorHandler('UnitGrouping not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})