const Role = require('../../../model/modules/user/role');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const User = require('../../../model/login/login')

// get All Role => /api/roles
exports.getAllRoles = catchAsyncErrors(async (req, res, next) => {
    let roles;

    try{
        roles = await Role.find({assignbusinessid: req.body.businessid,});
    }catch(err){
        console.log(err.message);
    }

    if(!roles){
        return next(new ErrorHandler('Role not found!', 400));
    }

    return res.status(200).json({
        roles
    });
})

exports.getAllAuthRoles = catchAsyncErrors(async (req, res, next) => {
    let roles;
    let result;

    try{
        roles = await Role.find();
        result = roles.filter((data,index)=>{
            return data.assignbusinessid == req.body.userloginbusinessid && data.rolename == req.body.userrole
        })
    }catch(err){
        console.log(err.message);
    }

    if(!roles){
        return next(new ErrorHandler('Role not found!', 400));
    }

    return res.status(200).json({
        // count: roles.length,
        result
    });
})

// Create new Role => /api/role/new
exports.addRole = catchAsyncErrors(async (req, res, next) =>{
    
    let addrole = await Role.create(req.body);

    return res.status(200).json({ 
        message: 'Successfully added!'
     });
})

// get Signle Role => /api/role/:id
exports.getSingleRole = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let srole = await Role.findById(id);

    if(!srole){
        return next(new ErrorHandler('Role not found!', 400));
    }

    return res.status(200).json({
        srole
    })
})

// update Role by id => /api/role/:id
exports.updateRole = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uprole = await Role.findByIdAndUpdate(id, req.body);

    if (!uprole) {
      return next(new ErrorHandler('Role not found!', 400));
    }
    return res.status(200).json({ 
        message: 'Updated Successfully!'
     });
})

// delete Role by id => /api/role/:id
exports.deleteRole = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let drole = await Role.findByIdAndRemove(id);

    if(!drole){
        return next(new ErrorHandler('Role not found!', 400));
    }
    
    return res.status(200).json({
        message: 'Deleted Successfully!'
    });
})

exports.EditRole = catchAsyncErrors(async (req, res, next) => {
    let roleedit
    try {
        roleedit = await User.find({ assignbusinessid: req.body.assignbusinessid,   role: req.body.role })


    } catch (err) {
        console.log(err.message);
    }
 
    if (!roleedit) {
        return next(new ErrorHandler('Department not found', 404));
    }
    return res.status(200).json({
        roleedit
    });
})
