const Busisetng = require('../../../model/modules/settings/businesssettings');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Busisetng => /api/busisetngs
exports.getAllBusisetng = catchAsyncErrors(async (req, res, next) => {
    let busisetngs;

    try{
        busisetngs = await Busisetng.find()
    }catch(err){
        console.log(err.message);
    }

    if(!busisetngs){
        return next(new ErrorHandler('Business setting not found!', 400));
    }

    return res.status(200).json({busisetngs});
})

// get Login sigle settings => /api/busisetngs
exports.getSingleAuthBusisetng = catchAsyncErrors(async (req, res, next) => {
    let busisetngs;
    let result;

    try{
        busisetngs = await Busisetng.find()

        result = busisetngs.filter((data, index)=>{
            return data.businessid == req.body.userloginbusinessid
        })
    }catch(err){
        console.log(err.message);
    }

    if(!busisetngs){
        return next(new ErrorHandler('Business setting not found!', 400));
    }

    return res.status(200).json({result});
})

// Create new Busisetng => /api/busisetng/new
exports.addBusisetng = catchAsyncErrors(async (req, res, next) =>{
    let abusisetng = await Busisetng.create(req.body);

    return res.status(200).json({ 
        message: 'Successfully created!' 
    });
})

// get Signle Busisetng => /api/busisetng/:id
exports.getSingleBusisetng = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sbusilocation = await Busisetng.findById(id);

    if(!sbusilocation){
        return next(new ErrorHandler('Data not found!', 400));
    }

    return res.status(200).json({
        sbusilocation
    })
})

// update Busisetng by id => /api/busisetng/:id
exports.updateBusisetng = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upbusisetng = await Busisetng.findByIdAndUpdate(id, req.body);

    if (!upbusisetng) {
      return next(new ErrorHandler('Data not found!', 400));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Busisetng by id => /api/busisetng/:id
exports.deleteBusisetng = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dbusisetng = await Busisetng.findByIdAndRemove(id);

    if(!dbusisetng){
        return next(new ErrorHandler('Business setting not found!', 400));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})