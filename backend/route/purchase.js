const express = require('express');
const purchaseRoute = express.Router();

// connect purchase controller
const  {   getAllPurchaseProduct,   getAllPurchaseTaxrate,getAllPurchasesStockAdjustmeProducts,   getAllPurchaseUnit,    getAllPurchaseLocation,   getAllPurchaseSupplier,  getAllPurchases,getAllPurchasesList,getAllIndexPurchase,getAllTodayPurchase,getWeeklyPurchase,getAllTotalPurchases,getAllPurchasesStock,addPurchase,updatePurchase,getSinglePurchase,deletePurchase} = require('../controller/modules/purchase/purchase');

purchaseRoute.route('/checksupplier').post(getAllPurchaseSupplier);
purchaseRoute.route('/checkpurlocation').post(getAllPurchaseLocation);
purchaseRoute.route('/checkpurunit').post(getAllPurchaseUnit);
purchaseRoute.route('/checkpurproduct').post(getAllPurchaseProduct);
purchaseRoute.route('/checkpurtaxrates').post(getAllPurchaseTaxrate);
purchaseRoute.route('/purchases').post(getAllPurchases);
purchaseRoute.route('/purchasesstockadjustments').post(getAllPurchasesStockAdjustmeProducts);
purchaseRoute.route('/purchaseslist').post(getAllPurchasesList);
purchaseRoute.route('/purchasesautoid').post(getAllIndexPurchase);
purchaseRoute.route('/todaypurchases').post(getAllTodayPurchase);
purchaseRoute.route('/weeklypurchases').post(getWeeklyPurchase);
purchaseRoute.route('/totalpurchases').post(getAllTotalPurchases);
purchaseRoute.route('/purchasesstock').post(getAllPurchasesStock);
purchaseRoute.route('/purchase/new').post(addPurchase);
purchaseRoute.route('/purchase/:id').get(getSinglePurchase).put(updatePurchase).delete(deletePurchase);

// connect purchase return controller
const {   getAllPurchaseRtnTaxrate,   getAllPurchaseRtnProduct,   getAllPurchaseRtnUnit,   getAllPurchaseRtnLocation, getAllPurchaseRtnSupplier , getAllPurchasesrtn,getAllTodayPurchasertn,getTotalPurchasertn,addPurchasereturn,updatePurchasereturn,getSinglePurchasereturn,deletePurchasereturn } = require('../controller/modules/purchase/purchasereturn');
purchaseRoute.route('/checkreturnsupplier').post(getAllPurchaseRtnSupplier);
purchaseRoute.route('/checkreturnlocation').post(getAllPurchaseRtnLocation);
purchaseRoute.route('/checkpurrtnunit').post(getAllPurchaseRtnUnit);
purchaseRoute.route('/checkpurrtnproduct').post(getAllPurchaseRtnProduct);
purchaseRoute.route('/checkpurrtntaxrates').post(getAllPurchaseRtnTaxrate);
purchaseRoute.route('/purchasereturns').post(getAllPurchasesrtn);
purchaseRoute.route('/todaypurchasereturns').post(getAllTodayPurchasertn);
purchaseRoute.route('/totalpurchasertn').post(getTotalPurchasertn);
purchaseRoute.route('/purchasereturn/new').post(addPurchasereturn);
purchaseRoute.route('/purchasereturn/:id').get(getSinglePurchasereturn).put(updatePurchasereturn).delete(deletePurchasereturn);
 
module.exports = purchaseRoute;
