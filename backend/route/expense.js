const express = require('express');
const expenseRoute = express.Router();

// connect expense category controller
const {  EditExCategory, getAllExpenseTaxrate,  getAllExpenseLocation, getAllExpenseCategory, getAllECate,addECate,updateECate,getSingleECate,deleteECate } = require('../controller/modules/expense/expensecategories');
expenseRoute.route('/checkexpcategory').post(getAllExpenseCategory);
expenseRoute.route('/checkexplocation').post(getAllExpenseLocation);
expenseRoute.route('/editexcategory').post(EditExCategory);
expenseRoute.route('/checkexptaxrates').post(getAllExpenseTaxrate);
expenseRoute.route('/expcategories').post(getAllECate);
expenseRoute.route('/expcategory/new').post(addECate);
expenseRoute.route('/expcategory/:id').get(getSingleECate).put(updateECate).delete(deleteECate);
 
// connect expense category controller
const { getAllExpense,getAllTotalExpenses,getAllTodayexpense,addExpense,updateExpense,getSingleExpense,deleteExpense } = require('../controller/modules/expense/expense');

expenseRoute.route('/expenses').post(getAllExpense);
expenseRoute.route('/todayexpenses').post(getAllTodayexpense);
expenseRoute.route('/totalexpenses').post(getAllTotalExpenses);
expenseRoute.route('/expense/new').post(addExpense);
expenseRoute.route('/expense/:id').get(getSingleExpense).put(updateExpense).delete(deleteExpense);
 
module.exports = expenseRoute;
