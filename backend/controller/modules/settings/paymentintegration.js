const Paymentintegration = require('../../../model/modules/settings/paymentintegration');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Paymentintegration => /api/paymentintegrations

exports.getAllPaymentintegration = catchAsyncErrors(async (req, res, next) => {
    let paymentintegrations;

    try{
        paymentintegrations = await Paymentintegration.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }

    if(!paymentintegrations){
        return next(new ErrorHandler('Paymentintegration not found!', 404));
    }

    let paymentlocation = paymentintegrations.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
            return data
        }
    })

    return res.status(200).json({
        paymentlocation,
        paymentintegrations
    });
})

// Create new Paymentintegration => /api/paymentintegration/new

exports.addPaymentintegration = catchAsyncErrors(async (req, res, next) =>{
   let apaymentintegration = await Paymentintegration.create(req.body)

    return res.status(200).json({ message: 'Successfully added!' });
})

// get Signle Paymentintegration => /api/paymentintegration/:id

exports.getSinglePaymentintegration = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let spaymentintegration = await Paymentintegration.findById(id);

    if(!spaymentintegration){
        return next(new ErrorHandler('Paymentintegration not found!', 404));
    }

    return res.status(200).json({
        spaymentintegration
    })
})

// update Paymentintegration by id => /api/paymentintegration/:id

exports.updatePaymentintegration = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upaymentintegration = await Paymentintegration.findByIdAndUpdate(id, req.body);

    if (!upaymentintegration) {
      return next(new ErrorHandler('Paymentintegration not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
});

// delete Paymentintegration by id => /api/paymentintegration/:id

exports.deletePaymentintegration = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dpaymentintegration = await Paymentintegration.findByIdAndRemove(id);

    if(!dpaymentintegration){
        return next(new ErrorHandler('Paymentintegration not found!', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})