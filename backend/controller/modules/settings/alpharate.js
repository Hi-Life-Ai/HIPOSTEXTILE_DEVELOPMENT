const Alpharate = require('../../../model/modules/settings/alpharate');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Alphacreate => /api/alpharates
exports.getAllAlpharate = catchAsyncErrors(async (req, res, next) => {
    let alpharates;

    try{
        alpharates = await Alpharate.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }

    if(!alpharates){
        return next(new ErrorHandler('Alpharate not found!', 400));
    }

    return res.status(200).json({
        alpharates
    });
})

exports.getAllAlpharateActive = catchAsyncErrors(async (req, res, next) => {
    let alpharates;

    try{
        alpharates = await Alpharate.find({assignbusinessid: req.body.businessid, activate:true})
    }catch(err){
        console.log(err.message);
    }

    if(!alpharates){
        return next(new ErrorHandler('Alpharate not found!', 400));
    }

    return res.status(200).json({
        alpharates
    });
})

// Create new Alpharate => /api/alpharate/new
exports.addAlpharate = catchAsyncErrors(async (req, res, next) =>{

    let aalpharates = await Alpharate.create(req.body);

    return res.status(200).json({ 
        message: 'Successfully added!' });
})

// get Signle Alpharate => /api/alpharate/:id
exports.getSingleAlpharate = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let salpharate = await Alpharate.findById(id);

    if(!salpharate){
        return next(new ErrorHandler('Alpharatenot found!', 400));
    }

    return res.status(200).json({
        salpharate
    })
})

// update Alpharate by id => /api/alpharate/:id
exports.updateAlpharate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ualpharate = await Alpharate.findByIdAndUpdate(id, req.body);

    if (!ualpharate) {
      return next(new ErrorHandler('Alpharate not found!', 400));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Alpharate by id => /api/alpharate/:id
exports.deleteAlpharate = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dalpharate = await Alpharate.findByIdAndRemove(id);

    if(!dalpharate){
        return next(new ErrorHandler('Alpharate not found!', 400));
    }
    
    return res.status(200).json({
        message: 'Deleted successfully'
    });
})