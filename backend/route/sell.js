const express = require('express');
const sellRoute = express.Router();

// connect Drafts controller
const {getAllDraftTaxrate,   getAllDraftProduct,    getAllDraftLocation,   getAllDraftCustomer,   getAllDrafts,getAllDraftSales,getAllTodayDrafts,addDraft,updateDraft,getSingleDraft,deleteDraft } = require('../controller/modules/sell/draft');
sellRoute.route('/checkdraftcustomer').post(getAllDraftCustomer);
sellRoute.route('/checkdraftlocation').post(getAllDraftLocation);
sellRoute.route('/checkdraftproduct').post(getAllDraftProduct);
sellRoute.route('/checkdrafttaxrates').post(getAllDraftTaxrate);
sellRoute.route('/todaydrafts').post(getAllTodayDrafts);
sellRoute.route('/alldrafts').post(getAllDraftSales);
sellRoute.route('/drafts').post(getAllDrafts);
sellRoute.route('/draft/new').post(addDraft);
sellRoute.route('/draft/:id').get(getSingleDraft).put(updateDraft).delete(deleteDraft);

// connect Quoation controller
const {getAllQuotationTaxrate,     getAllQuotationProduct ,   getAllQuotationLocation,    getAllQuotationCustomer,   getAllQuotations,getAllQuotationSales,getAllTodayQuotations,addQuotation,updateQuotation,getSingleQuotation,deleteQuotation } = require('../controller/modules/sell/quoation');
sellRoute.route('/checkquotationcustomer').post(getAllQuotationCustomer);
sellRoute.route('/checkquotationlocation').post(getAllQuotationLocation);
sellRoute.route('/checkquotationproduct').post(getAllQuotationProduct);
sellRoute.route('/checkquotationtaxrates').post(getAllQuotationTaxrate);
sellRoute.route('/quoations').post(getAllQuotations);
sellRoute.route('/allquoations').post(getAllQuotationSales);
sellRoute.route('/todayquoations').post(getAllTodayQuotations);
sellRoute.route('/quoation/new').post(addQuotation);
sellRoute.route('/quoation/:id').get(getSingleQuotation).put(updateQuotation).delete(deleteQuotation);

// pos bill
const { getTopFiveProdTable,   getCurrentTopFiveCustomers, getAllPosTaxrate,getAllPosProduct,getAllPosLocation,getAllPosCustomer,getAllPos,getCurrentTopFiveProducts,getWeeklySale,getTotalSales,addPos,getAllPosSales,getAllTodayPos,getSinglePos,updatePos,deletePos } = require('../controller/modules/sell/pos');

sellRoute.route('/checkposcustomer').post(getAllPosCustomer);
sellRoute.route('/checkposlocation').post(getAllPosLocation);
sellRoute.route('/checkposproduct').post(getAllPosProduct);
sellRoute.route('/checkpostaxrates').post(getAllPosTaxrate);
sellRoute.route('/pos').post(getAllPos);
sellRoute.route('/allpos').post(getAllPosSales);
sellRoute.route('/todaysales').post(getAllTodayPos);
sellRoute.route('/currentmonthtopfivesales').post(getCurrentTopFiveProducts);
sellRoute.route('/topfiveprodtable').post(getTopFiveProdTable);
sellRoute.route('/currentmontcustomers').post(getCurrentTopFiveCustomers);
sellRoute.route('/weeklysales').post(getWeeklySale);
sellRoute.route('/recentsales').post(getTotalSales);
sellRoute.route('/pos/new').post(addPos);
sellRoute.route('/pos/:id').get(getSinglePos).put(updatePos).delete(deletePos);


module.exports = sellRoute;
