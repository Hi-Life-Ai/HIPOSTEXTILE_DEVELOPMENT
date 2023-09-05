const express = require('express');
const productRoute = express.Router();

//authorized route
const { isAuthorized } = require('../middleware/routeauthorised');

// connect product controller
const { getAllProductTaxrate, getAllProductCategory, getAllProductsStockCategory, getAllProductsStockCategoryFilter, overAllEditProduct, getAllProductsByCSC_BSB_SandColorandStyle, getAllProductBrand, getAllProductLocation, getAllProductSize, getAllProductStyle, getAllProductColor, getAllProductUnit, getAllProductRack, getAllProducts, getAllProductsStock, getAllIndexProductsName, getAllIndexProducts, getAllProductsSingleStock, getLastIndexproduct, addProduct, updateProduct, getSingleProduct, deleteProduct } = require('../controller/modules/product/product');
productRoute.route('/checkprodlocation').post(getAllProductLocation);
productRoute.route('/checkprodsize').post(getAllProductSize);
productRoute.route('/checkprodstyle').post(getAllProductStyle);
productRoute.route('/checkprodcolor').post(getAllProductColor);
productRoute.route('/checkprodunit').post(getAllProductUnit);
productRoute.route('/checkprodrack').post(getAllProductRack);
productRoute.route('/checkprodbrand').post(getAllProductBrand);
productRoute.route('/checkprodcategory').post(getAllProductCategory);
productRoute.route('/checkprodtaxrates').post(getAllProductTaxrate);
productRoute.route('/editproductname').post(overAllEditProduct);

productRoute.route('/products').post(getAllProducts);
productRoute.route('/productsstock').post(getAllProductsStock);
productRoute.route('/stocksproductcategories').post(getAllProductsStockCategory);

productRoute.route('/productsautoid').post(getAllIndexProducts);
productRoute.route('/productsname').post(getAllIndexProductsName);
productRoute.route('/productssinglestock').post(getAllProductsSingleStock);
productRoute.route('/productlastindex').get(getLastIndexproduct);
productRoute.route('/product/new').post(addProduct);
productRoute.route('/product/:id').get(getSingleProduct).put(updateProduct).delete(deleteProduct);

//stock adjustmentstockcategoryviceproducts
productRoute.route('/productsbycsc_bsb_sizeandcolorandstyle').post(getAllProductsByCSC_BSB_SandColorandStyle);
productRoute.route('/stockcategoryviceproducts').post(getAllProductsStockCategoryFilter);

// connect unit controller
const { getAllUnitEdit, getAllUnitGroupingUnit, getAllUnits, addUnit, updateUnit, getSingleUnit, deleteUnit } = require('../controller/modules/product/unit');
productRoute.route('/unitedit').post(getAllUnitEdit);
productRoute.route('/checkgroupingsunit').post(getAllUnitGroupingUnit);
productRoute.route('/units').post(getAllUnits);
productRoute.route('/unit/new').post(addUnit);
productRoute.route('/unit/:id').get(getSingleUnit).put(updateUnit).delete(deleteUnit);

// connect category controller
const { getAllCategories,getStockCategories, getAllCategorySubcategories, getAllSubCategories, getAllCategoryBrand, addCategory, updateCategory, getSingleCategory, deleteCategory, EditCategory } = require('../controller/modules/product/category');
productRoute.route('/categories').post(getAllCategories);
productRoute.route('/stockscategories').post(getStockCategories);
productRoute.route('/subcategories').post(getAllSubCategories);
productRoute.route('/categorysubcategories').post(getAllCategorySubcategories);
productRoute.route('/categorybrands').post(getAllCategoryBrand);
productRoute.route('/category/new').post(addCategory);
productRoute.route('/category/:id').get(getSingleCategory).put(updateCategory).delete(deleteCategory);
productRoute.route('/editcategory').post(EditCategory);

// connect size controller
const { EditSizeName, getAllSizes, getAllSizesLimit, addSize, updateSize, getSingleSize, deleteSize } = require('../controller/modules/product/size');
productRoute.route('/editsize').post(EditSizeName);
productRoute.route('/sizes').post(getAllSizes);
productRoute.route('/sizeslimit').get(getAllSizesLimit);
productRoute.route('/size/new').post(addSize);
productRoute.route('/size/:id').get(getSingleSize).put(updateSize).delete(deleteSize);

// connect color controller
const { EditColorName, getAllColors, addColor, getSingleColor, updateColor, deleteColor } = require('../controller/modules/product/color');
productRoute.route('/coloredit').post(EditColorName);
productRoute.route('/colors').post(getAllColors);
productRoute.route('/color/new').post(addColor);
productRoute.route('/color/:id').get(getSingleColor).put(updateColor).delete(deleteColor);

// connect discounts controller
const { getAllDiscountLocation, getAllDiscounts, addDiscount, updateDiscount, getSingleDiscount, deleteDiscount } = require('../controller/modules/product/discount');
productRoute.route('/checkdiscountslocation').post(getAllDiscountLocation);
productRoute.route('/discounts').post(getAllDiscounts);
productRoute.route('/discount/new').post(addDiscount);
productRoute.route('/discount/:id').get(getSingleDiscount).put(updateDiscount).delete(deleteDiscount);


// connect stock controller
const { getAllStocks, getAllStockSalesProducts, getAllStockProducts, getSaleSupplierCount, addStock, getSingleStock, updateStock, deleteStock, getAllStockSize, getAllStockBrand, getAllStockCategory, getAllStockRack } = require('../controller/modules/product/stock');

productRoute.route('/stocks').post(getAllStocks);
productRoute.route('/allstocksproducts').post(getAllStockSalesProducts);
productRoute.route('/stocksproducts').post(getAllStockProducts);
productRoute.route('/stock/new').post(addStock);
productRoute.route('/stock/:id').get(getSingleStock).put(updateStock).delete(deleteStock);
productRoute.route('/innerstockarray').post(getSaleSupplierCount);
productRoute.route('/checkstocksize').post(getAllStockSize);
productRoute.route('/checkstockbrand').post(getAllStockBrand);
productRoute.route('/checkstockcategory').post(getAllStockCategory);
productRoute.route('/checkstockrack').post(getAllStockRack);

// connect category controller
const { EditBrandName, getAllBrands, getAllSubBrands, getAllSubBrandsSubArray, addBrands, getAllSubrands, getSingleBrand, updateBrand, deleteBrand } = require('../controller/modules/product/brand');
productRoute.route('/editbrandname').post(EditBrandName);
productRoute.route('/brands').post(getAllBrands);
productRoute.route('/subbrands').post(getAllSubrands);
productRoute.route('/allsubbrands').post(getAllSubBrands);
productRoute.route('/allsubbrandssubarray').post(getAllSubBrandsSubArray);
productRoute.route('/brand/new').post(addBrands);
productRoute.route('/brand/:id').get(getSingleBrand).put(updateBrand).delete(deleteBrand);

// connect category group 
const { getAllGroupBrand, getAllGroupCategory, getAllGroup, addGroup, getSingleGroup, updateGroup, deleteGroup } = require('../controller/modules/product/group');
productRoute.route('/checkgroupsbrand').post(getAllGroupBrand);
productRoute.route('/checkgroupscategory').post(getAllGroupCategory);
productRoute.route('/groups').post(getAllGroup);
productRoute.route('/group/new').post(addGroup);
productRoute.route('/group/:id').get(getSingleGroup).put(updateGroup).delete(deleteGroup);

// connect unit controller
const { getAllUnitGrouping, addUnitGrouping, updateUnitGrouping, getSingleUnitGrouping, deleteUnitGrouping } = require('../controller/modules/product/unitgroup');

productRoute.route('/unitgroupings').post(getAllUnitGrouping);
productRoute.route('/unitgrouping/new').post(addUnitGrouping);
productRoute.route('/unitgrouping/:id').get(getSingleUnitGrouping).put(updateUnitGrouping).delete(deleteUnitGrouping);

// connect role controller
const { getAllRack, addRack, getSingleRack, updateRack, deleteRack, OverAllEditRack } = require('../controller/modules/product/rack');
productRoute.route('/racks').post(getAllRack);
productRoute.route('/rack/new').post(addRack);
productRoute.route('/rack/:id').get(getSingleRack).put(updateRack).delete(deleteRack);
productRoute.route('/editracks').post(OverAllEditRack);

// connect style controller
const { EditStyleName, getAllStyle, addStyle, updateStyle, getSingleStyle, deleteStyle } = require('../controller/modules/product/style');
productRoute.route('/styleedit').post(EditStyleName);
productRoute.route('/styles').post(getAllStyle);
productRoute.route('/style/new').post(addStyle);
productRoute.route('/style/:id').get(getSingleStyle).put(updateStyle).delete(deleteStyle);

// connect section group controller
const { getAllSectionGroup, addSectionGroup, getSingleSectionGroup, updateSectionGroup, deleteSectionGroup, getAllSectionGroupCategory, overAllEditSection } = require('../controller/modules/product/sectiongroup');

productRoute.route('/sectiongoups').post(getAllSectionGroup);
productRoute.route('/sectiongroup/new').post(addSectionGroup);
productRoute.route('/sectiongroup/:id').get(getSingleSectionGroup).put(updateSectionGroup).delete(deleteSectionGroup);
productRoute.route('/checksectiongoupscategory').post(getAllSectionGroupCategory);
productRoute.route('/editsectionname').post(overAllEditSection);

module.exports = productRoute;
