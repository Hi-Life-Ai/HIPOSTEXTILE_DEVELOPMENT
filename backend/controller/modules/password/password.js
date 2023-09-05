const Password = require('../../../model/modules/password/password');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Passwords => /api/passwords 
exports.getAllPasswords = catchAsyncErrors(async (req, res, next) => {
    let passwords;

    try {
        passwords = await Password.find({assignbusinessid: req.body.businessid})
    } catch (err) {
        console.log(err.message);
    }

    if (!passwords) {
        return next(new ErrorHandler('Password not found!', 400));
    }

    return res.status(200).json({
        passwords
    });
})

// Create new Password => /api/password/new
exports.addPasswords = catchAsyncErrors(async (req, res, next) => {

    addpassword = await Password.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single password => /api/password/:id
exports.getSinglePasswords = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spassword = await Password.findById(id);

    if (!spassword) {
        return next(new ErrorHandler('Password not found!', 400));
    }

    return res.status(200).json({
        spassword
    })
})

// update Password by id => /api/password/:id
exports.updatePasswords = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upassword = await Password.findByIdAndUpdate(id, req.body);

    if (!upassword) {
        return next(new ErrorHandler('Password not found!', 400));
    }
    return res.status(200).json({
        message: 'Updated Successfully!'
    });
})

// delete Password by id => /api/password/:id
exports.deletePasswords = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dpassword = await Password.findByIdAndRemove(id);

    if(!dpassword){
        return next(new ErrorHandler('Password not found!', 400));
    }
    
    return res.status(200).json({
        message: 'Deleted Successfully!'
    });
})