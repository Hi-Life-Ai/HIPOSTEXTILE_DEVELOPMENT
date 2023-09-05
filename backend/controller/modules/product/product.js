const Product = require('../../../model/modules/product/product');
const Discount = require('../../../model/modules/product/discount');
const Purchase = require('../../../model/modules/purchase/purchase')
const PurchaseRtn = require('../../../model/modules/purchase/purchasereturn')
const Pos = require('../../../model/modules/sell/pos')
const Draft = require('../../../model/modules/sell/draft')
const Quotation = require('../../../model/modules/sell/quoation')
const cateGrouping = require('../../../model/modules/product/group');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All product => /api/products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    let products;
    let result;
    try{
        result = await Product.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Product not found!', 404));
    }

    products = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        products
    });
})

// get All products stock
exports.getAllProductsStock = catchAsyncErrors(async (req, res, next) => {
    let products;
    let result;
    try{
        result = await Product.find({assignbusinessid: req.body.businessid},{sku:1, productname:1, currentstock:1,maxquantity:1,businesslocation:1, minquantity:1})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Product not found!', 404));
    }

    products = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        products
    });
})

//get All product category
// get All products stock
exports.getAllProductsStockCategory = catchAsyncErrors(async (req, res, next) => {
    let products;
    try{
        products = await Product.find({
            assignbusinessid: req.body.businessid, 
            category: req.body.productcategory, 
            subcategory: req.body.productsubcategory, 
            businesslocation: req.body.productlocation
        })
    
        if(!products){
            return next(new ErrorHandler('Data not found!', 404));
        }
    
        return res.status(200).json({
            count: products.length,
            products
        });
    }catch(err){
        console.log(err.message);
    }
    
})

//get All products sku
exports.getAllIndexProducts = catchAsyncErrors(async (req, res, next) => {
    let products;
    try{
        products = await Product.find({assignbusinessid: req.body.businessid},{sku:1})
    }catch(err){
        console.log(err.message);
    }
    if(!products){
        return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({
        products
    });
})
exports.getAllIndexProductsName = catchAsyncErrors(async (req, res, next) => {
    let products;
    try{
        products = await Product.find({assignbusinessid: req.body.businessid},{productname:1})
    
    
        let result = products.map((d) => {
            return d.productname
        })

        if(!result){
            return next(new ErrorHandler('Product not found!', 404));
        }
        return res.status(200).json({
            result
        });

    }catch(err){
        console.log(err.message);
    }
    
})
// get All Purchases => /api/purchases
exports.getAllProductsSingleStock = catchAsyncErrors(async (req, res, next) => {
    let result;
    let productssinglestocks;

    try{
        result = await Product.find({assignbusinessid: req.body.businessid, sku:req.body.productid})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Purchase not found!', 404));
    }

    //filter location role
    productssinglestocks = result?.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })

    return res.status(200).json({
        productssinglestocks
    });
})

// get All product => /api/products
exports.getLastIndexproduct = catchAsyncErrors(async (req, res, next) => {
    let products;
    try{
        products = await Product.find()
    }catch(err){
        console.log(err.message);
    }
    
    let lastindex = products[products.length - 1];
    if(!lastindex){
        return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        // products
        lastindex
    });
})

//update category
exports.getCategoryUpdate = catchAsyncErrors(async (req, res, next) => {
    let productEdit
    let discountEdit
    let categrpedit
    try {
        categrpedit = await cateGrouping.aggregate([{$unwind : '$categories'} , {$match: {"categories.categoryname":  req.body.category}},])
        discountEdit = await Discount.find({  category: req.body.category   })
        productEdit = await Product.find({ category: req.body.category})
    } catch (err) {
        console.log(err.message);
    }
    if (!categrpedit) {
        return next(new ErrorHandler('Data not found', 404));
    }
    return res.status(200).json({
        count : productEdit.length + discountEdit.length + categrpedit.length ,
        productEdit, 
        categrpedit, 
        discountEdit
    });
})
// Stockadjustment start 
exports.getAllProductsByCSC_BSB_SandColorandStyle = catchAsyncErrors(async (req, res, next) => {
    try {
        let query = {};
        Object.keys(req.body).forEach((key) => {
            if(key !== 'headers'){
                const value = req.body[key];
             if (value !== '') {
                query[key] = { $eq: value.toString() };
            }
            }
            // const value = req.body[key];
            //  if (value !== '') {
            //     query[key] = { $eq: value.toString() };
            // }
        });
        const result = await Product.find(query);
        return res.status(200).json({
            products: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
});

exports.getAllProductsStockCategoryFilter = catchAsyncErrors(async (req, res, next) => {
    try {
        let query = {};
        Object.keys(req.body).forEach((key) => {
            if(key !== 'headers'){
                const value = req.body[key];
             if (value !== '') {
                query[key] = { $eq: value.toString() };
            }
            }
        });
        const result = await Product.find(query);
        return res.status(200).json({
            products: result,
        });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            error: 'Internal server error',
        });
    }
});

// Create new product => /api/product/new
exports.addProduct = catchAsyncErrors(async (req, res, next) =>{
   
    let aproduct = await Product.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Signle product => /api/product/:id
exports.getSingleProduct = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let sproduct = await Product.findById(id);

    if(!sproduct){
        return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({
        sproduct
    })
})
// update product by id => /api/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uproduct = await Product.findByIdAndUpdate(id, req.body);

    if (!uproduct) {
      return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})
// delete product by id => /api/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dproduct = await Product.findByIdAndRemove(id);

    if(!dproduct){
        return next(new ErrorHandler('Product not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})

// check the value is already used for location delete
exports.getAllProductLocation = catchAsyncErrors(async (req, res, next) => {
    let products;

    try {
        products = await Product.find({ assignbusinessid: req.body.businessid, businesslocation: req.body.checklocationid })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        products
    });
})

// check the value is already used for size delete
exports.getAllProductSize = catchAsyncErrors(async (req, res, next) => {
    let products;

    try {
        products = await Product.find({ assignbusinessid: req.body.businessid, size: req.body.checksize })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        products
    });
})

// check the value is already used for style delete
exports.getAllProductStyle = catchAsyncErrors(async (req, res, next) => {
    let products;

    try {
        products = await Product.find({ assignbusinessid: req.body.businessid, style: req.body.checkstyle })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        products
    });
})

// check the value is already used for color delete
exports.getAllProductColor = catchAsyncErrors(async (req, res, next) => {
    let products;

    try {
        products = await Product.find({ assignbusinessid: req.body.businessid, color: req.body.checkcolor })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        products
    });
})

// check the value is already used for unit delete
exports.getAllProductUnit = catchAsyncErrors(async (req, res, next) => {
    let products;

    try {
        products = await Product.find({ assignbusinessid: req.body.businessid, unit: req.body.checkunit })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        products
    });
})

// check the value is already used for rack delete
exports.getAllProductRack = catchAsyncErrors(async (req, res, next) => {
    let products;
    const checkRacks = req.body.checkrack.map(item => item.subrackcode); // Extract the rack values from checkrack array
    
    try {
        products = await Product.find({
            assignbusinessid: req.body.businessid,
            rack: { $in: checkRacks }
        });
    }
    catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        products
    });
})


// check the value is already used for brand delete
exports.getAllProductBrand = catchAsyncErrors(async (req, res, next) => {
    let products;

    try {
        products = await Product.find({ assignbusinessid: req.body.businessid, brand: req.body.checkbrand })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        products
    });
})

// check the value is already used for category delete
exports.getAllProductCategory = catchAsyncErrors(async (req, res, next) => {
    let products;

    try {
        products = await Product.find({ assignbusinessid: req.body.businessid, category: req.body.checkcategory })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        products
    });
})

// check the value is already used for taxrate delete
exports.getAllProductTaxrate = catchAsyncErrors(async (req, res, next) => {
    let products;

    try {
        products = await Product.find({
            assignbusinessid: req.body.businessid,
            $or: [
                { applicabletax: req.body.checktaxrates },
                { hsn: req.body.checkhsn },
            ]
        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Product not found!', 404));
    }

    return res.status(200).json({
        products
    });
})

//product update
// product edit function for purchase, purchasereturn, pos, draft, quotation
exports.overAllEditProduct = catchAsyncErrors(async (req, res, next) => {
    let purchase, purchasereturn, pos, draft, quotation;

    try {
        const [
            purchase,
            purchasereturn,
            pos,
            draft,
            quotation
        ] = await Promise.all([
            Purchase.find({
                assignbusinessid: req.body.businessid,
                products: {
                    $elemMatch: {
                        prodname: req.body.productname,
                    }
                },
            }),
            PurchaseRtn.find({
                assignbusinessid: req.body.businessid,
                products: {
                    $elemMatch: {
                        prodname: req.body.productname,
                    }
                },
            }),
            Pos.find({
                assignbusinessid: req.body.businessid,
                goods: {
                    $elemMatch: {
                        productname: req.body.productname,
                    }
                },
            }),
            Draft.find({
                assignbusinessid: req.body.businessid,
                goods: {
                    $elemMatch: {
                        productname: req.body.productname,
                    }
                },
            }),
            Quotation.find({
                assignbusinessid: req.body.businessid,
                goods: {
                    $elemMatch: {
                        productname: req.body.productname,
                    }
                },
            })
        ])
        return purchase,purchasereturn,pos,draft,quotation
        // purchase = await Purchase.find({
        //     assignbusinessid: req.body.businessid,
        //     products: {
        //         $elemMatch: {
        //             prodname: req.body.productname,
        //         }
        //     },
        // })
        // purchasereturn = await PurchaseRtn.find({
        //     assignbusinessid: req.body.businessid,
        //     products: {
        //         $elemMatch: {
        //             prodname: req.body.productname,
        //         }
        //     },
        // })
        // pos = await Pos.find({
        //     assignbusinessid: req.body.businessid,
        //     goods: {
        //         $elemMatch: {
        //             productname: req.body.productname,
        //         }
        //     },
        // })
        // draft = await Draft.find({
        //     assignbusinessid: req.body.businessid,
        //     goods: {
        //         $elemMatch: {
        //             productname: req.body.productname,
        //         }
        //     },
        // })
        // quotation = await Quotation.find({
        //     assignbusinessid: req.body.businessid,
        //     goods: {
        //         $elemMatch: {
        //             productname: req.body.productname,
        //         }
        //     },
        // })
    } catch (err) {
        console.log(err.message);
    }

    if (!purchase) {
        return next(new ErrorHandler('Product not found', 404));
    }
    return res.status(200).json({
        count: purchase.length +  purchasereturn.length + pos.length + draft.length + quotation.length,
        purchase, purchasereturn, pos, draft, quotation
    });
})
