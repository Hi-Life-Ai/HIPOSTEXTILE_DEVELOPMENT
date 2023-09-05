const Expcategory = require('../../../model/modules/expense/expensecategories');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Expense =require('../../../model/modules/expense/expense');

// get All Expcategory => /api/expcategorys
exports.getAllECate = catchAsyncErrors(async (req, res, next) => {
    let excategorys;

    try{
        excategorys = await Expcategory.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }

    if(!excategorys){
        return next(new ErrorHandler('Expense Category not found!', 404));
    }

    return res.status(200).json({
        excategorys
    });
})

// Create new Expcategory => /api/expcategory/new
exports.addECate = catchAsyncErrors(async(req, res, next) =>{

   
   let aexcategory = await Expcategory.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})

// get Signle Expcategory => /api/expcategory/:id
exports.getSingleECate = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sexcategory = await Expcategory.findById(id);

    if(!sexcategory){
        return next(new ErrorHandler('Expense Category not found!', 404));
    }

    return res.status(200).json({
        sexcategory
    })
});

// update Expcategory by id => /api/expcategory/:id
exports.updateECate = catchAsyncErrors(async (req, res, next) => {

    let upexcategory = await Expcategory.findByIdAndUpdate(req.params.id ,  req.body);

    if (!upexcategory) {
      return next(new ErrorHandler('Expense Category not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})

// delete Expcategory by id => /api/expcategory/:id
exports.deleteECate = catchAsyncErrors(async (req, res, next)=>{
   let dexcategory = await Expcategory.findByIdAndRemove(req.params.id);

    if(!dexcategory){
        return next(new ErrorHandler('Expense Category not found!', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})

// check the value is already used for exp category delete
exports.getAllExpenseCategory = catchAsyncErrors(async (req, res, next) => {
    let expenses;
    try {
        expenses = await Expense.find({ assignbusinessid: req.body.businessid, expcategory: req.body.checkexpcategory, })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!expenses) {
        return next(new ErrorHandler('Expense not found!', 404));
    }
    return res.status(200).json({
        expenses
    });
})

// check the value is already used for exp location delete
exports.getAllExpenseLocation = catchAsyncErrors(async (req, res, next) => {
    let expenses;
    try {
        expenses = await Expense.find({ assignbusinessid: req.body.businessid, businesslocation: req.body.checklocationid, })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!expenses) {
        return next(new ErrorHandler('Expense not found!', 404));
    }
    return res.status(200).json({
        expenses
    });
})

// check the value is already used for taxrate delete
exports.getAllExpenseTaxrate = catchAsyncErrors(async (req, res, next) => {
    let expenses;

    try {
        expenses = await Expense.find({
            assignbusinessid: req.body.businessid,
            $or: [
                { exptax: req.body.checktaxrates },
                { exptax: req.body.checkhsn },
            ]
        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!expenses) {
        return next(new ErrorHandler('Expense not found!', 404));
    }

    return res.status(200).json({
        expenses
    });
})

exports.EditExCategory = catchAsyncErrors(async (req, res, next) => {
    let excategory

    try {
        excategory = await Expense.find({  assignbusinessid: req.body.assignbusinessid,expcategory: req.body.expcategory })


    } catch (err) {
        console.log(err.message);
    }
   
    if (!excategory) {
        return next(new ErrorHandler('expcategory not found', 404));
    }
    return res.status(200).json({
        excategory
    });
})