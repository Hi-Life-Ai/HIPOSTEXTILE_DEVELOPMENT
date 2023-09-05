const Style = require('../../../model/modules/product/style');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Product = require('../../../model/modules/product/product');

// get All Styles => /api/styles
exports.getAllStyle = catchAsyncErrors(async (req, res, next) => {
    let styles;
    try{
        styles = await Style.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }
    if(!styles){
        return next(new ErrorHandler('Style not found!', 404));
    }

    return res.status(200).json({
        styles
    });
})

// Create new Style => /api/style/new
exports.addStyle = catchAsyncErrors(async (req, res, next) =>{
   
    let astyle = await Style.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' ,
    });
})
// get Signle Style => /api/style/:id
exports.getSingleStyle = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sstyle = await Style.findById(id);

    if(!sstyle){
        return next(new ErrorHandler('Style not found!', 404));
    }
    return res.status(200).json({
        sstyle
    })
})
// update Style by id => /api/style/:id
exports.updateStyle = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ustyle = await Style.findByIdAndUpdate(id, req.body);

    if (!ustyle) {
      return next(new ErrorHandler('Style not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})
// delete Style by id => /api/style/:id
exports.deleteStyle = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dstyle = await Style.findByIdAndRemove(id);

    if(!dstyle){
        return next(new ErrorHandler('Style not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})
exports.EditStyleName = catchAsyncErrors(async (req, res, next) => {
    let stylename
    try {
        stylename = await Product.find({ assignbusinessid: req.body.assignbusinessid, style: req.body.stylename })

    } catch (err) {
        console.log(err.message);
    }
   
    if (!stylename) {
        return next(new ErrorHandler('style not found', 404));
    }
    return res.status(200).json({
        stylename
    });
})