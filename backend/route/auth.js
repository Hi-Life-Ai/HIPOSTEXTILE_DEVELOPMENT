const express = require('express');
const authRoute = express.Router();

//authorized route
const { isAuthorized } = require('../middleware/routeauthorised');

// connect customer group controller
const { getAllUsers,getAllUsersTermsFalseLocation,getAllUserRole, getAllUserDepartment, getAllUserLocation, getAllUsersTermsTrue,getAllUsersTermsFalse,updateUserpw, regUser, regAuth, loginAuth, loginOut, forgotPassword, resetPassword, getSingleUser, updateUser, deleteUser } = require('../controller/login/auth');

authRoute.route('/users').get(getAllUsers); // this is for get all users
authRoute.route('/userstermstrue').get(getAllUsersTermsTrue); 
authRoute.route('/userstermsfalse').post(getAllUsersTermsFalse);
authRoute.route('/userslocation').post(getAllUsersTermsFalseLocation);
authRoute.route('/auth/new').post(regAuth); // this is for signup create
authRoute.route('/user/new').post(regUser); // this is for user create
authRoute.route('/password/forgot').post(forgotPassword);
authRoute.route('/password/reset/:token').put(resetPassword);
authRoute.route('/auth/:id').get(getSingleUser).put(updateUser).delete(deleteUser);
authRoute.route('/userpw/:id').put(updateUserpw);
authRoute.route('/authlog').post(loginAuth);
authRoute.route('/authout').get(loginOut);
//delete function
authRoute.route('/checkrole').post(getAllUserRole); // this is for get all users
authRoute.route('/checkdepartment').post(getAllUserDepartment); // this is for get all users
authRoute.route('/checklocation').post(getAllUserLocation);

module.exports = authRoute;