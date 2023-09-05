const Customer = require('../../../model/modules/contact/customer');
const Businesslocation = require('../../../model/modules/settings/businesslocation');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Draft = require('../../../model/modules/sell/draft');
const Pos = require('../../../model/modules/sell/pos');
const Quotation = require('../../../model/modules/sell/quoation');

// get All Customer => /api/customers
exports.getAllCustomer = catchAsyncErrors(async (req, res, next) => {
    let customers;

    try {
        customers = await Customer.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }

    if (!customers) {
        return next(new ErrorHandler('Customer not found', 404));
    }

    return res.status(200).json({
        customers
    });
})

// Create new Customer => /api/customer/new
exports.addCustomer = catchAsyncErrors(async (req, res, next) => {

    let acustomer = await Customer.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Customer => /api/customer/:id

exports.getSingleCustomer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let scustomer = await Customer.findById(id);

    if (!scustomer) {
        return next(new ErrorHandler('Customer not found', 404));
    }

    return res.status(200).json({
        scustomer
    })
})

// update Customer by id => /api/customer/:id

exports.updateCustomer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upcustomer = await Customer.findByIdAndUpdate(id, req.body);

    if (!upcustomer) {
        return next(new ErrorHandler('Customer not found', 404));
    }

    return res.status(200).json({ message: 'Updates successfully' });
})

// delete Customer by id => /api/customer/:id

exports.deleteCustomer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcustomer = await Customer.findByIdAndRemove(id);

    if (!dcustomer) {
        return next(new ErrorHandler('Customer not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


// check the value is already used for customer group delete
exports.getAllCustomerGroup = catchAsyncErrors(async (req, res, next) => {
    let customers;
    try {
        customers = await Customer.find({ assignbusinessid: req.body.businessid, customergroup: req.body.checkcustomergroup, })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!customers) {
        return next(new ErrorHandler('Customer not found!', 404));
    }
    return res.status(200).json({
        customers
    });
})

// edit check the value is already used for pos, draft and quotation update
exports.getAllCustomerEdit = catchAsyncErrors(async (req, res, next) => {
    let draft, quotation, pos1;
    try {
        draft = await Draft.find({ contactid: req.body.contactid, assignbusinessid: req.body.businessid })
        quotation = await Quotation.find({ contactid: req.body.contactid, assignbusinessid: req.body.businessid })
        pos1 = await Pos.find({ contactid: req.body.contactid, assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!draft) {
        return next(new ErrorHandler('Customer not found', 404));
    }
    return res.status(200).json({
        count: draft.length + quotation.length + pos1.length,
        draft, quotation, pos1
    });
})