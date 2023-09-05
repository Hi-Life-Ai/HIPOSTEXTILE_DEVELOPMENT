const User = require('../model/login/login');
const ErrorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('./catchAsyncError');
const jwt = require('jsonwebtoken')


//check if user is authenticated or not
exports.isAuthorized = catchAsyncErrors( async(req, res, next) => {
    //  9h after adding cookie
    const headcookie = req.headers.cookie;
    // console.log(headcookie);
    const token = headcookie.split("=")[1];
    // console.log(token)
    // for menr-course
    // const { token } = req.cookies;

    // // console.log(token);

    // if(!token){
    //     return next(new ErrorHandler('Login first to access this resoure', 401));
    // }

    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // req.user = await User.findById(decoded.id);

    // next();

    // for headers only 9h before adding cookie
    // const headtoken = req.headers[`authorization`];
    // // console.log(headtoken);

    // const token = headtoken.split(" ")[1];

    if(!token){
        return next(new ErrorHandler('Login first to access this resoure', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    // console.log(req.user.id)

    next();


});