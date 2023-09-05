const express = require ('express');
const passwordRoute = express.Router();

//authorized route
const { isAuthorized } = require('../middleware/routeauthorised');

//connect password controller
const { getAllPasswords, addPasswords, getSinglePasswords, updatePasswords, deletePasswords } = require('../controller/modules/password/password');

passwordRoute.route('/passwords').post(getAllPasswords);
passwordRoute.route('/password/new').post(addPasswords);
passwordRoute.route('/password/:id').get(getSinglePasswords).put(updatePasswords).delete(deletePasswords);

//connect folder controller
const { getAllFolders, addFolders, getSingleFolders, updateFolders, deleteFolders } = require('../controller/modules/password/folder');

passwordRoute.route('/folders').post(getAllFolders);
passwordRoute.route('/folder/new').post(addFolders);
passwordRoute.route('/folder/:id').get(getSingleFolders).put(updateFolders).delete(deleteFolders);

//connect userassignment controller
const { getAllAssigned,addAssigned,getSingleAssigned,updateAssigned, deleteAssigned} = require('../controller/modules/password/userassignment');

passwordRoute.route('/userassignments').post(getAllAssigned);
passwordRoute.route('/userassign/new').post(addAssigned);
passwordRoute.route('/userassign/:id').get(getSingleAssigned).put(updateAssigned).delete(deleteAssigned);

module.exports = passwordRoute;