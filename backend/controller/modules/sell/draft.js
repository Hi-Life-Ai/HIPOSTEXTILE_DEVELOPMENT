const Draft = require('../../../model/modules/sell/draft');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
 //  Datefield
 var today = new Date();
 var dd = String(today.getDate()).padStart(2, '0');
 var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
 var yyyy = today.getFullYear();
 today = yyyy + '-' + mm + '-' + dd;

// get All Draft => /api/drafts
exports.getAllDrafts = catchAsyncErrors(async (req, res, next) => {
    let drafts;
    let result;

    try{
        result = await Draft.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }

    if(!result){
        return next(new ErrorHandler('Draft not found!', 400));
    }
    
    drafts = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        drafts
    });
})

exports.getAllDraftSales = catchAsyncErrors(async (req, res, next) => {
    let drafts;
    let result;
    try{
        result = await Draft.find({assignbusinessid: req.body.businessid},{date:1,referenceno:1,businesslocation:1,customer:1,contactnumber:1,aftergranddisctotal:1,totalitems:1,userbyadd:1})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Draft not found!', 404));
    }
    
    drafts = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })
    
    return res.status(200).json({
        drafts
    });
})

exports.getAllTodayDrafts = catchAsyncErrors(async (req, res, next) => {
    let drafts;
    let result;

    try{
        result = await Draft.find({assignbusinessid: req.body.businessid, today:today})
    }catch(err){
        console.log(err.message);
    }

    if(!result){
        return next(new ErrorHandler('Draft not found!', 400));
    }
    
    drafts = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        drafts
    });
})

// Create new Draft => /api/draft/new
exports.addDraft = catchAsyncErrors(async (req, res, next) =>{
   let adraft = await Draft.create(req.body)

   return res.status(200).json({ 
    message: 'Successfully added!' 
});
})

// get Signle Draft => /api/draft/:id
exports.getSingleDraft = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sdraft = await Draft.findById(id);

    if(!sdraft){
        return next(new ErrorHandler('Draft not found!', 400));
    }

    return res.status(200).json({
        sdraft
    })
})

// update Draft by id => /api/draft/:id
exports.updateDraft = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let udraft = await Draft.findByIdAndUpdate(id, req.body);

    if (!udraft) {
      return next(new ErrorHandler('Draft not found!', 400));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Draft by id => /api/draft/:id
exports.deleteDraft = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let ddraft = await Draft.findByIdAndRemove(id);

    if(!ddraft){
        return next(new ErrorHandler('Draft not found!', 400));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})
// check the value is already used for customer delete
exports.getAllDraftCustomer = catchAsyncErrors(async (req, res, next) => {
    let drafts;
    try {
        drafts = await Draft.find({assignbusinessid: req.body.businessid, customer: req.body.checkcustomer,})        
    }
    catch (err) {
        console.log(err.message);
    }
    if (!drafts) {
        return next(new ErrorHandler('Draft not found!', 404));
    }
    return res.status(200).json({
        drafts
    });
})

// check the value is already used for location delete
exports.getAllDraftLocation = catchAsyncErrors(async (req, res, next) => {
    let drafts;
    try {
        drafts = await Draft.find({assignbusinessid: req.body.businessid, businesslocation: req.body.checklocationid,})        
    }
    catch (err) {
        console.log(err.message);
    }
    if (!drafts) {
        return next(new ErrorHandler('Draft not found!', 404));
    }
    return res.status(200).json({
        drafts
    });
})

// check the value is already used for product delete
exports.getAllDraftProduct = catchAsyncErrors(async (req, res, next) => {
    let drafts;
    try {
        drafts = await Draft.find({
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
    if (!drafts) {
        return next(new ErrorHandler('Draft not found!', 404));
    }
    return res.status(200).json({
        drafts
    });
})

// check the value is already used for taxrate delete
exports.getAllDraftTaxrate = catchAsyncErrors(async (req, res, next) => {
    let drafts;

    try {
        drafts = await Draft.find({
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
    if (!drafts) {
        return next(new ErrorHandler('Draft not found!', 404));
    }

    return res.status(200).json({
        drafts
    });
})