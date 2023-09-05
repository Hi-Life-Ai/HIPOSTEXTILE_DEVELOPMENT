const Stock = require('../../../model/modules/product/stock');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Stocks => /api/stocks
exports.getAllStocks = catchAsyncErrors(async (req, res, next) => {
    let stocks;
    try {
        stocks = await Stock.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!stocks) {
        return next(new ErrorHandler('Stock not found!', 400));
    }

    return res.status(200).json({
        stocks
    });
})

// get All Purchases => /api/purchases
exports.getAllStockSalesProducts = catchAsyncErrors(async (req, res, next) => {
    let allstocks;
    let result;
    let stockproducts = [];
    const query = {
        assignbusinessid: req.body.businessid,
        products: {
            $elemMatch: {
                sku: req.body.productid,
            }
        }
    };


    try {
        result = await Stock.find(query);

        if (!result) {
            return next(new ErrorHandler('Data not found!', 404));
        }

        //filter location role
        allstocks = result.filter((data, index) => {
            if (req.body.role == 'Admin') {
                return data
            } else if (req.body.userassignedlocation.includes(data.businesslocation)) {
                return data
            }
        })

        //filter products
        let dataallstocks = allstocks?.map((data, index) => {
            return data.products
        })
        //individual products
        dataallstocks.forEach((value) => {
            value.forEach((valueData) => {
                if (req?.body?.productid == valueData?.sku) {
                    stockproducts.push(valueData);
                }
            })
        })

        return res.status(200).json({
            stockproducts
        });
    } catch (err) {
        console.log(err.message);
    }

})

// get All Purchases => /api/purchases
exports.getAllStockProducts = catchAsyncErrors(async (req, res, next) => {
    let allstocks;
    let result;
    let stockproducts = [];

    try {
        result = await Stock.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Purchase not found!', 404));
    }

    //filter location role
    allstocks = result.filter((data, index) => {
        if (req.body.role == 'Admin') {
            return data
        } else if (req.body.userassignedlocation.includes(data.businesslocation)) {
            return data
        }
    })

    //filter products
    let dataallstocks = allstocks?.map((data, index) => {
        return data.products
    })
    //individual products
    dataallstocks.forEach((value) => {
        value.forEach((valueData) => {
            if (req.body.productid == valueData.sku) {
                stockproducts.push(valueData);
            }
        })
    })

    return res.status(200).json({
        stockproducts
    });
})

// Create new Stock => /api/stock/new
exports.addStock = catchAsyncErrors(async (req, res, next) => {

    let astock = await Stock.create(req.body)

    return res.status(201).json({
        message: 'Successfully added!'
    });
})

// get Signle Stock => /api/stock/:id
exports.getSingleStock = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sstock = await Stock.findById(id);

    if (!sstock) {
        return next(new ErrorHandler('Stock not found!', 404));
    }
    return res.status(200).json({
        sstock
    })
})

// inner array update Stock by id => /api/stock/:id
exports.getSaleSupplierCount = catchAsyncErrors(async (req, res, next) => {

    let result;
    let stockproducts = [];
    let dataallstocks = [];

    const query = {
        assignbusinessid: req.body.businessid,
        products: {
            $elemMatch: {
                sku: req.body.productid,
                salestatus: "Sold"
            }
        }
    };

    try {

        result = await Stock.find(query);

        if (!result) {
            return next(new ErrorHandler('Data not found!', 404));
        }
        //filter products
        dataallstocks = result?.map((data, index) => {
            return data.products
        })
        //individual products
        dataallstocks?.forEach((value) => {
            value?.forEach((valueData) => {
                if (req?.body?.productid == valueData?.sku && valueData.salestatus == "Sold") {
                    stockproducts.push(valueData);
                }
            })
        })

        return res.status(200).json({
            count: stockproducts.length,
            stockproducts
        });
    } catch (err) {
        console.log(err.message);
    }
});

// update Stock by id => /api/stock/:id
exports.updateStock = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ustock = await Stock.findByIdAndUpdate(id, req.body);

    if (!ustock) {
        return next(new ErrorHandler('Stock not found!', 404));
    }

    return res.status(200).json({
        message: 'Updated successfully!'
    });
});


// delete Stock by id => /api/stock/:id
exports.deleteStock = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dstock = await Stock.findByIdAndRemove(id);

    if (!dstock) {
        return next(new ErrorHandler('Stock not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

// check the value is already used for size delete
exports.getAllStockSize = catchAsyncErrors(async (req, res, next) => {
    let stock;
    
    try {
        stock = await Stock.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    size: req.body.checksize,
                }
            },
        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!stock) {
        return next(new ErrorHandler('Stock not found!', 404));
    }

    return res.status(200).json({
        stock
    });
})

// check the value is already used for brand short delete
exports.getAllStockBrand = catchAsyncErrors(async (req, res, next) => {
    let stock;
    
    try {
        stock = await Stock.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    brand: req.body.checkbrandshortname,
                }
            },
        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!stock) {
        return next(new ErrorHandler('Stock not found!', 404));
    }

    return res.status(200).json({
        stock
    });
})

// check the value is already used for category short delete
exports.getAllStockCategory = catchAsyncErrors(async (req, res, next) => {
    let stock;
  
    try {
        stock = await Stock.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    category: req.body.checkcategoryshortname,
                }
            },
        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!stock) {
        return next(new ErrorHandler('Stock not found!', 404));        
    }

    return res.status(200).json({
        stock
    });
})

// check the value is already used for rack delete
exports.getAllStockRack = catchAsyncErrors(async (req, res, next) => {
    let stock;
    const checkRacks = req.body.checkrack.map(item => item.subrackcode); // Extract the rack values from checkrack array
    
    try {
        stock = await Stock.find({
            assignbusinessid: req.body.businessid,
            rack: { $in: checkRacks }
        });
    }
    catch (err) {
        console.log(err.message);
    }
    if (!stock) {
        return next(new ErrorHandler('Stock not found!', 404));
    }

    return res.status(200).json({
        stock
    });
})