const express = require('express');
const settingRoute = express.Router();

// connect business settings controller
const { getAllBusisetng,getSingleAuthBusisetng,addBusisetng,updateBusisetng,deleteBusisetng,getSingleBusisetng } = require('../controller/modules/settings/busisettings');

settingRoute.route('/busisetngs').get(getAllBusisetng);
settingRoute.route('/busisetng/new').post(addBusisetng);
settingRoute.route('/authbusisetng').post(getSingleAuthBusisetng);
settingRoute.route('/busisetng/:id').get(getSingleBusisetng).put(updateBusisetng).delete(deleteBusisetng);

// connect business location controller
const { getAllBusinessloc,addBusinessloc,updateBusinessloc,getSingleBusinessloc,deleteBusinessloc } = require('../controller/modules/settings/businesslocation');

settingRoute.route('/businesslocations').post(getAllBusinessloc);
settingRoute.route('/businesslocation/new').post(addBusinessloc);
settingRoute.route('/businesslocation/:id').get(getSingleBusinessloc).put(updateBusinessloc).delete(deleteBusinessloc);

// connect taxrate controller
const { getAllTaxrate,getAllTaxrateForgroupfalse,getAllTaxrateHsn,getAllTaxrateGroupForgroupfalse,getAllTaxrateGroup,getAllTaxrateGrouphsnForgroupfalse,addTaxrate,updateTaxrate,getSingleTaxrate,deleteTaxrate,overAllEditTax } = require('../controller/modules/settings/taxrate');

settingRoute.route('/taxrates').post(getAllTaxrate);
settingRoute.route('/taxratesforgroupfalse').post(getAllTaxrateForgroupfalse);
settingRoute.route('/taxrateshsn').post(getAllTaxrateHsn);
settingRoute.route('/taxratesgroupforgroupfalse').post(getAllTaxrateGroupForgroupfalse);
settingRoute.route('/taxratesgroup').post(getAllTaxrateGroup);
settingRoute.route('/taxratesforgrouphsnfalse').post(getAllTaxrateGrouphsnForgroupfalse);
settingRoute.route('/taxrate/new').post(addTaxrate);
settingRoute.route('/taxrate/:id').get(getSingleTaxrate).put(updateTaxrate).delete(deleteTaxrate);
settingRoute.route('/edittaxrates').post(overAllEditTax);

const { getAllAlpharate,getAllAlpharateActive,addAlpharate,updateAlpharate,getSingleAlpharate,deleteAlpharate } = require('../controller/modules/settings/alpharate');

settingRoute.route('/alpharates').post(getAllAlpharate);
settingRoute.route('/alpharatesactive').post(getAllAlpharateActive);
settingRoute.route('/alpharate/new').post(addAlpharate);
settingRoute.route('/alpharate/:id').get(getSingleAlpharate).put(updateAlpharate).delete(deleteAlpharate);

// payment ingration route
const { getAllPaymentintegration,addPaymentintegration,updatePaymentintegration,getSinglePaymentintegration,deletePaymentintegration } = require('../controller/modules/settings/paymentintegration');
settingRoute.route('/payments').post(getAllPaymentintegration);
settingRoute.route('/payment/new').post(addPaymentintegration);
settingRoute.route('/payment/:id').get(getSinglePaymentintegration).put(updatePaymentintegration).delete(deletePaymentintegration);

module.exports = settingRoute;
