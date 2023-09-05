const Category = require('../../../model/modules/product/category');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Product = require('../../../model/modules/product/product')
const CateGrouping = require('../../../model/modules/product/group')
const Discount = require('../../../model/modules/product/discount')
const Stock = require('../../../model/modules/product/stock')

// get All Categories => /api/brands
exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {

    try{
        let categories = await Category.find({ assignbusinessid: req.body.businessid })

    if (!categories) {
        return next(new ErrorHandler('Category not found!', 404));
    }

    return res.status(200).json({
        categories
    });
    }catch (err) {
        console.log(err.message);
    }
})

// get All Categories => /api/brands
exports.getStockCategories = catchAsyncErrors(async (req, res, next) => {

    let categories = [];
    let result = [];
    try{
        result = await Category.find({ assignbusinessid: req.body.businessid })

    if (!result) {
        return next(new ErrorHandler('Category not found!', 404));
    }

    categories = result.filter((data, index)=>{
        if(data.categoryname == req.body.productcategory){
          return index
        }
    })

    return res.status(200).json({
        categories
    });
    }
    catch (err) {
        console.log(err.message);
    }
})

// get All subcategories => /api/categorysubcategories
exports.getAllCategorySubcategories = catchAsyncErrors(async (req, res, next) => {
    let result;
    let subcatrgories = [];

    try {
        result = await Category.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Category not found!', 404));
    }

    //filter products
    let dataproducts = result.map((data, index) => {
        return data.subcategories
    })
    //individual products
    dataproducts.forEach((value) => {
        value.forEach((valueData) => {
            subcatrgories.push(valueData);
        })
    })

    return res.status(200).json({
        subcatrgories
    });
})

// get All subcategories => /api/categorysubcategories
exports.getAllCategoryBrand = catchAsyncErrors(async (req, res, next) => {
    let result;
    let brands = [];

    try {
        result = await Category.find({ assignbusinessid: req.body.businessid })
    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Category not found!', 404));
    }

    //filter products
    let dataproducts = result.map((data, index) => {
        return data.brands
    })
    //individual products
    dataproducts.forEach((value) => {
        value.forEach((valueData) => {
            brands.push(valueData);
        })
    })

    return res.status(200).json({
        brands
    });
})

exports.getAllSubCategories = catchAsyncErrors(async (req, res, next) => {
    const { businessid, categoryname } = req.body;
    let subcategories = [];
    try {
        let categories = await Category.find({ assignbusinessid: businessid, categoryname: { $eq: categoryname } })
        if (!categories) {
            return next(new ErrorHandler('Subcategory not found!', 404));
        }
        let dataproducts = categories.map((data) => {
            return data.subcategories
        })

        //individual products
        dataproducts.forEach((value) => {
            value.forEach((valueData) => {
                subcategories.push(valueData);
            })
        })
        return res.status(200).json({
            subcategories
        });
    } catch (err) {
        console.log(err.message);
    }
})

// Create new Brand => /api/brand/new
exports.addCategory = catchAsyncErrors(async (req, res, next) => {

    let acateogry = await Category.create(req.body)

    return res.status(201).json({ message: 'Successfully added!' });
})
// get Signle Brand => /api/brand/:id
exports.getSingleCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let scategory = await Category.findById(id);


    if (!scategory) {
        return next(new ErrorHandler('Category not found!', 404));
    }
    return res.status(200).json({
        scategory
    })
})
// update Brand by id => /api/brand/:id
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ucategory = await Category.findByIdAndUpdate(id, req.body);

    if (!ucategory) {
        return next(new ErrorHandler('Category not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Brand by id => /api/brand/:id
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dcategory = await Category.findByIdAndRemove(id);

    if (!dcategory) {
        return next(new ErrorHandler('Category not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.EditCategory = catchAsyncErrors(async (req, res, next) => {
    let productEdit
    let discountEdit
    let categrpedit
    let stock

    try {
        categrpedit = await CateGrouping.aggregate([{ $unwind: '$categories' }, { $match: { "categories.categoryname": req.body.category, assignbusinessid: req.body.businessid } },])
        discountEdit = await Discount.find({ assignbusinessid: req.body.businessid, category: req.body.category })
        productEdit = await Product.find({ assignbusinessid: req.body.businessid, category: req.body.category })
        stock = await Stock.find({
            assignbusinessid: req.body.businessid,
            products: {
                $elemMatch: {
                    category: req.body.categoryshotname,
                }
            },
        })
    } catch (err) {
        console.log(err.message);
    }
    if (!categrpedit) {
        return next(new ErrorHandler('Category not found', 404));
    }

    return res.status(200).json({
        count: productEdit.length + discountEdit.length + categrpedit.length + stock.length,
        productEdit, categrpedit, discountEdit , stock
    });
})