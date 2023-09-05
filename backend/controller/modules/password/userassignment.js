const Assigned = require('../../../model/modules/password/userassigment');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Assigned => /api/assigneds
exports.getAllAssigned = catchAsyncErrors(async (req, res, next) => {
    let assigneds = [];
    let result;
    let resultdata;

    try{
        result = await Assigned.find({assignbusinessid: req.body.businessid})
    
        if(!result){
            return next(new ErrorHandler('Data not found!', 400));
        }

        resultdata = result.filter((data, index)=>{
            if(req.body.role == 'Admin'){
                data.userid.forEach((item, i)=>{
                    assigneds.push(item)
                })
            }else if(req.body.userloginid == data.useruniqid){
                data.userid.forEach((item, i)=>{
                    assigneds.push(item)
                })
            }
            return assigneds
        })
    
        return res.status(200).json({
            result,
            assigneds
        });
    }catch(err){
        console.log(err.message);
    }

})

// Create new assigned => /api/assigned/new
exports.addAssigned = catchAsyncErrors(async (req, res, next) => {

    addassigned = await Assigned.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!'
    });
})


// get Signle Assigned => /api/assigned/:id
exports.getSingleAssigned = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sassigned = await Assigned.findById(id);

    if(!sassigned){
        return next(new ErrorHandler('Data not found!', 400));
    }

    return res.status(200).json({
        sassigned
    })
})

// update Assigned by id => /api/assigned/:id
exports.updateAssigned = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uassigned = await Assigned.findByIdAndUpdate(id, req.body);

    if (!uassigned) {
      return next(new ErrorHandler('Data not found!', 400));
    }
    return res.status(200).json({ 
        message: 'Updated Successfully!'
     });
})

// delete Assigned by id => /api/assigned/:id
exports.deleteAssigned = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dassigned = await Assigned.findByIdAndRemove(id);

    if(!dassigned){
        return next(new ErrorHandler('Data not found!', 400));
    }
    
    return res.status(200).json({
        message: 'Deleted Successfully!'
    });
})