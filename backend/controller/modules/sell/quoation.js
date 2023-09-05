const Quotation = require('../../../model/modules/sell/quoation');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
 //  Datefield
 var today = new Date();
 var dd = String(today.getDate()).padStart(2, '0');
 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
 var yyyy = today.getFullYear();
 today = yyyy + '-' + mm + '-' + dd;

// get All Quotation => /api/quotations
exports.getAllQuotations = catchAsyncErrors(async (req, res, next) => {
    let quotations;
    let result;

    try{
        result = await Quotation.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }

    if(!result){
        return next(new ErrorHandler('Quoation not found!', 400));
    }
    
    quotations = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        quotations
    });
})

exports.getAllQuotationSales = catchAsyncErrors(async (req, res, next) => {
    let quotations;
    let result;
    try{
        result = await Quotation.find({assignbusinessid: req.body.businessid},{date:1,referenceno:1,businesslocation:1,customer:1,contactnumber:1,aftergranddisctotal:1,totalitems:1,userbyadd:1})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Draft not found!', 404));
    }
    
    quotations = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })
    
    return res.status(200).json({
        quotations
    });
})

// get All Quotation today => /api/quotations
exports.getAllTodayQuotations = catchAsyncErrors(async (req, res, next) => {
    let quotations;
    let result;

    try{
        result = await Quotation.find({assignbusinessid: req.body.businessid, today:today})
    }catch(err){
        console.log(err.message);
    }

    if(!result){
        return next(new ErrorHandler('Quoation not found!', 400));
    }
    
    quotations = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        quotations
    });
})

// Create new Quotation => /api/quotation/new
exports.addQuotation = catchAsyncErrors(async (req, res, next) =>{
   let aquotation = await Quotation.create(req.body);

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})

// get Signle Quotation => /api/quotation/:id
exports.getSingleQuotation = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let squotation = await Quotation.findById(id);

    if(!squotation){
        return next(new ErrorHandler('Quoation not found!', 400));
    }

    return res.status(200).json({
        squotation
    })
})

// update Quotation by id => /api/quotation/:id
exports.updateQuotation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uquotation = await Quotation.findByIdAndUpdate(id, req.body);

    if (!uquotation) {
      return next(new ErrorHandler('Quoation not found!', 400));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Quotation by id => /api/quotation/:id
exports.deleteQuotation = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dquotation = await Quotation.findByIdAndRemove(id);

    if(!dquotation){
        return next(new ErrorHandler('Quoation not found!', 400));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})
// check the value is already used for customer delete
exports.getAllQuotationCustomer = catchAsyncErrors(async (req, res, next) => {
    let quotations;
    try {
        quotations = await Quotation.find({ assignbusinessid: req.body.businessid, customer: req.body.checkcustomer, })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!quotations) {
        return next(new ErrorHandler('Quoation not found!', 404));
    }

    return res.status(200).json({
        quotations
    });
})

// check the value is already used for location delete
exports.getAllQuotationLocation = catchAsyncErrors(async (req, res, next) => {
    let quotations;
    try {
        quotations = await Quotation.find({ assignbusinessid: req.body.businessid, businesslocation: req.body.checklocationid, })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!quotations) {
        return next(new ErrorHandler('Quoation not found!', 404));
    }
    return res.status(200).json({
        quotations
    });
})

// check the value is already used for product delete
exports.getAllQuotationProduct = catchAsyncErrors(async (req, res, next) => {
    let quotations;
    try {
        quotations = await Quotation.find({
            assignbusinessid: req.body.businessid,
            goods: {
                $elemMatch: {
                    productid: req.body.checksku,
                }
            },
        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!quotations) {
        return next(new ErrorHandler('Quoation not found!', 404));
    }
    return res.status(200).json({
        quotations
    });
})

// check the value is already used for taxrate delete
exports.getAllQuotationTaxrate = catchAsyncErrors(async (req, res, next) => {
    let quotations;

    try {
        quotations = await Quotation.find({
            assignbusinessid: req.body.businessid,
            goods: {
                $elemMatch: {
                    $or: [
                        { applicabletax: req.body.checktaxrates },
                        { applicabletax: req.body.checkhsn },
                    ]
                }
            },

        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!quotations) {
        return next(new ErrorHandler('Quoation not found!', 404));
    }

    return res.status(200).json({
        quotations
    });
})