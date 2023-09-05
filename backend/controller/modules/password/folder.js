const Folder = require('../../../model/modules/password/folder');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Folders => /api/folders 
exports.getAllFolders = catchAsyncErrors(async (req, res, next) => {
    let folders;

    try {
        folders = await Folder.find({assignbusinessid: req.body.businessid})
    } catch (err) {
        console.log(err.message);
    }

    if (!folders) {
        return next(new ErrorHandler('Folder not found!', 400));
    }

    return res.status(200).json({
        folders
    });
})

// Create new Folder => /api/folder/new
exports.addFolders = catchAsyncErrors(async (req, res, next) => {

    addfolder = await Folder.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single folder => /api/folder/:id
exports.getSingleFolders = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sfolder = await Folder.findById(id);

    if (!sfolder) {
        return next(new ErrorHandler('Folder not found!', 400));
    }

    return res.status(200).json({
        sfolder
    })
})

// update Folder by id => /api/folder/:id
exports.updateFolders = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ufolder = await Folder.findByIdAndUpdate(id, req.body);

    if (!ufolder) {
        return next(new ErrorHandler('Folder not found!', 400));
    }
    return res.status(200).json({
        message: 'Updated Successfully!'
    });
})

// delete Folder by id => /api/folder/:id
exports.deleteFolders = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dfolder = await Folder.findByIdAndRemove(id);

    if(!dfolder){
        return next(new ErrorHandler('Folder not found!', 400));
    }
    
    return res.status(200).json({
        message: 'Deleted Successfully!'
    });
})