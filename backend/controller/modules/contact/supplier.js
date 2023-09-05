const Supplier = require('../../../model/modules/contact/supplier');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const purchase = require('../../../model/modules/purchase/purchase');

// get All Supplier => /api/suppliers

exports.getAllSupplier = catchAsyncErrors(async (req, res, next) => {
    
    let suppliers;

    try{
        suppliers = await Supplier.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }

    if(!suppliers){
        return next(new ErrorHandler('Supplier not found!', 404));
    }

    return res.status(200).json({
        suppliers
    });
})

// get All Supplier => /api/suppliers

exports.getAllSupplierName = catchAsyncErrors(async (req, res, next) => {
    
    let suppliers;

    try{
        suppliers = await Supplier.find({assignbusinessid: req.body.businessid},{suppliername:1, autogenerate:1})
    }catch(err){
        console.log(err.message);
    }

    if(!suppliers){
        return next(new ErrorHandler('Supplier not found!', 404));
    }

    return res.status(200).json({
        suppliers
    });
})

// Create new Supplier => /api/supplier/new

exports.addSupplier = catchAsyncErrors(async (req, res, next) =>{

    // if(!req.body.email){
    //     let asupplier = await Supplier.create(req.body)
    //     .then(() => {
    //         // Handle successful save
    //         res.status(200).json({ message: 'Successfully added!' });
    //       })
    //       .catch(error => {
    //         console.log(error)
    //         // Handle duplicate key error
    //         if (error.code === 11000) {
    let asupplier = Supplier.create(req.body);
        return res.status(200).json({ 
            message: 'Successfully added!' 
    });
        //     }
        //   });
        // let asupplier = await Supplier.create(req.body); 

        // return res.status(200).json({ 
        //     message: 'Successfully added!' 
        // });
    // }

    // let asupplier = await Supplier.create(req.body);

    // return res.status(200).json({ 
    //     message: 'Successfully added!' 
    // });
})

// get Signle Supplier => /api/supplier/:id

exports.getSingleSupplier = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let ssupplier = await Supplier.findById(id);

    if(!ssupplier){
        return next(new ErrorHandler('Supplier not found', 404));
    }

    return res.status(200).json({
        ssupplier
    })
})

// update Supplier by id => /api/supplier/:id

exports.updateSupplier = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let usupplier = await Supplier.findByIdAndUpdate(id, req.body);

    if (!usupplier) {
      return next(new ErrorHandler('Supplier not found', 404));
    }
    
    return res.status(200).json({message: 'Updates successfully' });
})

// delete Supplier by id => /api/supplier/:id

exports.deleteSupplier = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;
    let dsupplier = await Supplier.findByIdAndRemove(id);

    if(!dsupplier){
        return next(new ErrorHandler('Supplier not found', 404));
    }
    
    return res.status(200).json({message: 'Deleted successfully'});
})

exports.EditSupplierName = catchAsyncErrors(async (req, res, next) => {
    let suppliername
    try {

        suppliername = await purchase.find({ assignbusinessid: req.body.assignbusinessid, supplier: req.body.suppliername })


    } catch (err) {
        console.log(err.message);
    }
   
    if (!suppliername) {
        return next(new ErrorHandler('Department not found', 404));
    }
    return res.status(200).json({
        suppliername
    });
})