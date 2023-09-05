const Transfer = require('../../../model/modules/stock/transfer');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Transfers => /api/transfers
exports.getAllTransfers = catchAsyncErrors(async (req, res, next) => {
    let transfers;
    let result;
    try{
        result = await Transfer.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Data not found!', 404));
    }

    transfers = result?.filter((data, index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.fromlocation)){
          return data
        }
    })
    return res.status(200).json({
        transfers
    });
})

// get All Transfers => /api/transfers
exports.getAllTransfersData = catchAsyncErrors(async (req, res, next) => {
    let alltransfers = [];
    let result;
    let userLocations = req.body.userassignedlocation;
    let filteredDataTransfer = [];
    let products = []


    try{
        result = await Transfer.find({assignbusinessid: req.body.businessid, status:false, reject:false})
        
        if(!result){
            return next(new ErrorHandler('Data not found!', 404));
        }
    
        if(req.body.role == "Admin"){
            alltransfers = result?.filter((data, index)=>{
                return data
            })  
        }else{
            result.forEach((data, index)=>{
                // let products = []
                data?.products?.forEach((product)=> {
                    let quantity = {}
                    for (let key in product.quantity) {
                        if (userLocations.includes(key)) {
                            quantity[key] = product.quantity[key]
                        }
                    }
                    let locations = product?.locations?.filter((data, index)=> {
                        if (userLocations.includes(data)) {
                            return true;
                        }
                    })
                    if (locations.length != 0) {
                        let productData = product
                        productData["quantity"] = quantity
                        productData["locations"] = locations

                        products.push(productData)
    
                    }
                    
                })
                if (products.length != 0) {
                    let dataTransfer = data
                    dataTransfer["products"] = products
                    filteredDataTransfer.push(dataTransfer)
    
                }
            }) 
        }
        let allresult = req.body.role == "Admin" ? alltransfers : filteredDataTransfer
        return res.status(200).json({
            allresult
        });
    }catch(err){
        console.log(err.message);
    }
    
})

exports.getAllAdjustData = catchAsyncErrors(async (req, res, next) => {
    let alladjusts = [];
    let result;
    let userLocations = req.body.userassignedlocation;
    let filteredDataTransfer = [];
    let products = []


    try{
        result = await Transfer.find({assignbusinessid: req.body.businessid, status:true, reject:false})
        
        if(!result){
            return next(new ErrorHandler('Data not found!', 404));
        }
    
        if(req.body.role == "Admin"){
            alladjusts = result?.filter((data, index)=>{
                return data
            })  
        }else{
            result.forEach((data, index)=>{
                // let products = []
                data?.products?.forEach((product)=> {
                    let quantity = {}
                    for (let key in product.quantity) {
                        if (userLocations.includes(key)) {
                            quantity[key] = product.quantity[key]
                        }
                    }
                    let locations = product?.locations?.filter((data, index)=> {
                        if (userLocations.includes(data)) {
                            return true;
                        }
                    })
                    if (locations.length != 0) {
                        let productData = product
                        productData["quantity"] = quantity
                        productData["locations"] = locations

                        products.push(productData)
    
                    }
                    
                })
                if (products.length != 0) {
                    let dataTransfer = data
                    dataTransfer["products"] = products
                    filteredDataTransfer.push(dataTransfer)
    
                }
            }) 
        }
        let allresult = req.body.role == "Admin" ? alladjusts : filteredDataTransfer
        return res.status(200).json({
            allresult
        });
    }catch(err){
        console.log(err.message);
    }
    
})

// Create new transfer => /api/transfer/new
exports.addTransfer = catchAsyncErrors(async (req, res, next) => {

    let transfers = await Transfer.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Signle transfer => /api/transfer/:id
exports.getSingleTransfer = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let stransfer = await Transfer.findById(id);

    if(!stransfer){
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({
        stransfer
    })
})
// update transfer by id => /api/transfer/:id
exports.updateTransfer = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let utransfer = await Transfer.findByIdAndUpdate(id, req.body);

    if (!utransfer) {
      return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})
// delete Transfer by id => /api/transfer/:id
exports.deleteTransfer = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dtransfer = await Transfer.findByIdAndRemove(id);

    if(!dtransfer){
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})