const Discount = require('../../../model/modules/product/discount');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Discount => /api/discounts
exports.getAllDiscounts = catchAsyncErrors(async (req, res, next) => {
    let discounts;
    let result;

    try{
        result = await Discount.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }

    if(!result){
        return next(new ErrorHandler('Discount not found!', 400));
    }

    discounts = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        discounts
    });
})

// Create new Discount => /api/discount/new
exports.addDiscount = catchAsyncErrors(async (req, res, next) =>{

   let adiscount = await Discount.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})

// get Signle Discount => /api/discount/:id
exports.getSingleDiscount = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sdiscount = await Discount.findById(id);

    if(!sdiscount){
        return next(new ErrorHandler('Discount not found!', 400));
    }

    return res.status(200).json({
        sdiscount
    })
})

// update Discount by id => /api/discount/:id
exports.updateDiscount = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let udiscount = await Discount.findByIdAndUpdate(id, req.body);

    if (!udiscount) {
      return next(new ErrorHandler('Discount not found!', 400));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Discount by id => /api/discount/:id
exports.deleteDiscount = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let ddiscount = await Discount.findByIdAndRemove(id);

    if(!ddiscount){
        return next(new ErrorHandler('Discount not found!', 400));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})
// check the value is already used for location delete
exports.getAllDiscountLocation = catchAsyncErrors(async (req, res, next) => {
    let discounts;

    try {
        discounts = await Discount.find({ assignbusinessid: req.body.businessid, businesslocation: req.body.checklocationid })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!discounts) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        discounts
    });
})