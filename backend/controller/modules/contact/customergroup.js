const Customergroup = require('../../../model/modules/contact/customergroup');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Customer = require('../../../model/modules/contact/customer')

// get All Customergroup => /api/cgroups

exports.getAllCGroup = catchAsyncErrors(async (req, res, next) => {
    let cgroups;

    try{
        cgroups = await Customergroup.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }

    if(!cgroups){
        return next(new ErrorHandler('Customer group not found!', 404));
    }

    return res.status(200).json({
        cgroups
    });
})

// Create new Customergroup => /api/cgroup/new

exports.addCGroup = catchAsyncErrors(async (req, res, next) =>{

    let acgroup = await Customergroup.create(req.body)

    return res.status(201).json({ 
        message: 'Successfully added!'
     });
})

// get Signle Customergroup => /api/cgroup/:id

exports.getSingleCGroup = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let scgroup = await Customergroup.findById(id);
  
    if(!scgroup){
        return next(new ErrorHandler('Customer group not found!', 404));
    }

    return res.status(200).json({
        scgroup
    })
})

// update Customergroup by id => /api/cgroup/:id

exports.updateCGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upcgroup = await Customergroup.findByIdAndUpdate(id, req.body);

    if (!upcgroup) {
      return next(new ErrorHandler('Customer group not found!', 404));
    }

    return res.status(200).json({message: 'Updated successfully' });
})

// delete Customergroup by id => /api/cgroup/:id
exports.deleteCGroup = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    
    let dcgroup = await Customergroup.findByIdAndRemove(id);

    if(!dcgroup){
        return next(new ErrorHandler('Customer group not found!', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})

// edit check customer group in customer
exports.EditCusGrp = catchAsyncErrors(async (req, res, next) => {
    let customerGrp
    try {
        customerGrp = await Customer.find({ assignbusinessid: req.body.assignbusinessid, customergroup: req.body.cusgroupname })


    } catch (err) {
        console.log(err.message);
    }
   
    if (!customerGrp) {
        return next(new ErrorHandler('cusgroupname not found', 404));
    }
    return res.status(200).json({
        customerGrp
    });
})
