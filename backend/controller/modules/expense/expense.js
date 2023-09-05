const Expense = require('../../../model/modules/expense/expense');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const moment = require('moment');
//  Datefield
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
// get All Expense => /api/expenses
exports.getAllExpense = catchAsyncErrors(async (req, res, next) => {
    let expenses;
    let result;

    try{
        result = await Expense.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }

    if(!result){
        return next(new ErrorHandler('Expense not found!', 404));
    }

    expenses = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        expenses
    });
}) 

exports.getAllTotalExpenses = catchAsyncErrors(async (req, res, next) => {
    const { startdate, enddate, islocation, location } = req.body

    let expenseall;
    let result;
    try {
        result = await Expense.find({ assignbusinessid: req.body.businessid,today: { $gte: startdate, $lte: enddate }})
        resultlocation = await Expense.find({ assignbusinessid: req.body.businessid,businesslocation: location,today: { $gte: startdate, $lte: enddate }})
    
        if (!result) {
            return next(new ErrorHandler('Data not found!', 404));
        }
    
        expenseall = islocation ? resultlocation : result
        return res.status(200).json({
            expenseall
        });

    } catch (err) {
        console.log(err.message);
    }
})

// get All expense today => /api/products
exports.getAllTodayexpense = catchAsyncErrors(async (req, res, next) => {
    let todayexpense;
    let result;
    try{
        result = await Expense.find({assignbusinessid: req.body.businessid,today:today})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Data not found!', 404));
    }
    
    todayexpense = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })
    
    return res.status(200).json({
        todayexpense
    });
})

// Create new Expense => /api/expense/new
exports.addExpense = catchAsyncErrors(async (req, res, next) =>{
   let aexpense = await Expense.create(req.body)

    return res.status(200).json({ message: 'Successfully added!' });
})

// get Signle Expense => /api/expense/:id
exports.getSingleExpense = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sexpense = await Expense.findById(id);

    if(!sexpense){
        return next(new ErrorHandler('Expense not found!', 404));
    }

    return res.status(200).json({
        sexpense
    })
})

// update Expense by id => /api/expense/:id
exports.updateExpense = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upexpense = await Expense.findByIdAndUpdate(id, req.body);

    if (!upexpense) {
      return next(new ErrorHandler('Expense not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
});

// delete Expense by id => /api/expense/:id
exports.deleteExpense = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dexpense = await Expense.findByIdAndRemove(id);

    if(!dexpense){
        return next(new ErrorHandler('Expense not found!', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})


