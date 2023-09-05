const Brand = require('../../../model/modules/product/brand');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Product = require('../../../model/modules/product/product')
const Group = require('../../../model/modules/product/group');
const Stock = require('../../../model/modules/product/stock');

// get All Categories => /api/brands
exports.getAllBrands = catchAsyncErrors(async (req, res, next) => {

    let brands = await Brand.find({ assignbusinessid: req.body.businessid })

    if (!brands) {
        return next(new ErrorHandler('Brand not found!', 404));
    }

    return res.status(200).json({
        brands
    });
})

// get All subcategories => /api/categorysubbrands
exports.getAllSubrands = catchAsyncErrors(async (req, res, next) => {
    let result;
    let subbrands = [];

    try {
        result = await Brand.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Brand not found!', 404));
    }

    //filter products
    let dataproducts = result.map((data, index) => {
        return data.subbrands
    })
    //individual products
    dataproducts.forEach((value) => {
        value.forEach((valueData) => {
            subbrands.push(valueData);
        })
    })

    return res.status(200).json({
        subbrands
    });
})

exports.getAllSubBrands = catchAsyncErrors(async (req, res, next) => {
    const { businessid, brandname } = req.body;
    let subbrands = [];
    try{
        let brands = await Brand.find({ assignbusinessid: businessid, brandname: { $eq: brandname } })
        if (!brands) {
            return next(new ErrorHandler('Subbrand not found!', 404));
        }
        let dataproducts = brands.map((data) => {
            return data.subbrands
        })
    
        //individual products
        dataproducts.forEach((value)=>{
            value.forEach((valueData)=>{
                subbrands.push(valueData);
            })
            })
        return res.status(200).json({
            subbrands
        });
    }catch(err){
        console.log(err.message);
    }
})

exports.getAllSubBrandsSubArray = catchAsyncErrors(async (req, res, next) => {
    const { businessid, brandname } = req.body;
    let subbrandssubarray = [];
    try{
        let brands = await Brand.find({ assignbusinessid: businessid, brandname: { $eq: brandname } })
        if (!brands) {
            return next(new ErrorHandler('Subbrand not found!', 404));
        }
        let dataproducts = brands.map((data) => {
            return data.subbrands
        })
    
        //individual products
        dataproducts.forEach((value)=>{
            value.forEach((valueData)=>{
                subbrandssubarray.push(valueData.subbrandname);
            })
            })
        return res.status(200).json({
            subbrandssubarray
        });
    }catch(err){
        console.log(err.message);
    }
})

// Create new Brand => /api/brand/new
exports.addBrands = catchAsyncErrors(async (req, res, next) => {

    let abrand = await Brand.create(req.body)

    return res.status(201).json({ message: 'Successfully added!' });
})

// get Signle Brand => /api/brand/:id
exports.getSingleBrand = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sbrand = await Brand.findById(id);


    if (!sbrand) {
        return next(new ErrorHandler('Brand not found!', 404));
    }
    return res.status(200).json({
        sbrand
    })
})

// update Brand by id => /api/brand/:id
exports.updateBrand = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ubrand = await Brand.findByIdAndUpdate(id, req.body);

    if (!ubrand) {
        return next(new ErrorHandler('Brand not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Brand by id => /api/brand/:id
exports.deleteBrand = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dbrand = await Brand.findByIdAndRemove(id);

    if (!dbrand) {
        return next(new ErrorHandler('Brand not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

// Edit brand start
exports.EditBrandName = catchAsyncErrors(async (req, res, next) => {
    let products, groups, stock
    try {
        products = await Product.find({ brand: { $eq: req.body.brand},assignbusinessid: req.body.businessid  })
        groups = await Group.find({ brandname: { $eq: req.body.brand},assignbusinessid: req.body.businessid  })
        stock = await Stock.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    brand: req.body.brandshortname,
                }
            },
        })
    } catch (err) {
        console.log(err.message);
    }
    if (!products) {
        return next(new ErrorHandler('Brand not found', 404));
    }
    return res.status(200).json({
        count: products.length + groups.length + stock.length,
        products, groups, stock
    });
}) 
