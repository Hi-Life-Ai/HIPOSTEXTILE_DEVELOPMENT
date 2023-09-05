const express = require('express');
const transferRoute = express.Router();

//Assigned Management 
const { getAllTransfers,getSingleTransfer,getAllTransfersData,getAllAdjustData,deleteTransfer,updateTransfer,addTransfer} = require('../controller/modules/stock/transfer');
transferRoute.route('/transfers').post(getAllTransfers);
transferRoute.route('/alltransfers').post(getAllTransfersData);
transferRoute.route('/alladjusts').post(getAllAdjustData);
transferRoute.route('/transfer/new').post(addTransfer);
transferRoute.route('/transfer/:id').get(getSingleTransfer).put(updateTransfer).delete(deleteTransfer);

// Adjustment Type
const { getAllAdjustment, addAdjustment, getSingleAdjustment, updateAdjustment, deleteAdjustment, overAllEditAdjustType } = require('../controller/modules/stock/adjustmenttype');
transferRoute.route('/adjustmenttypes').post(getAllAdjustment);
transferRoute.route('/adjustmenttype/new').post(addAdjustment);
transferRoute.route('/adjustmenttype/:id').get(getSingleAdjustment).put(updateAdjustment).delete(deleteAdjustment);
transferRoute.route('/editadjustmenttypes').post(overAllEditAdjustType);

// Stock Adjustment Type
const { getAllStockAjustment,getAdjustmentQuantity, addStockAjustment, getSingleStockAjustment, updateStockAjustment, deleteStockAjustment,getAllStockAjustmentSection, getAllStockAjustmentType } = require('../controller/modules/stock/adjustment');
transferRoute.route('/stockadjustments').post(getAllStockAjustment);
transferRoute.route('/stocksadjustproducts').post(getAdjustmentQuantity);
transferRoute.route('/stockadjustment/new').post(addStockAjustment);
transferRoute.route('/stockadjustment/:id').get(getSingleStockAjustment).put(updateStockAjustment).delete(deleteStockAjustment);
transferRoute.route('/checkstocksection').post(getAllStockAjustmentSection);
transferRoute.route('/checkstockadjusttype').post(getAllStockAjustmentType);

// Stock ManualstockEntry....
const { getAllManualstockentry, addManualstock, getSingleManualStock, updateManualstock, deleteManualstock} = require('../controller/modules/stock/manualstockentry');
transferRoute.route('/manualstockentrys').post(getAllManualstockentry);
transferRoute.route('/manualstockentry/new').post(addManualstock);
transferRoute.route('/manualstockentry/:id').get(getSingleManualStock).put(updateManualstock).delete(deleteManualstock);

module.exports = transferRoute;