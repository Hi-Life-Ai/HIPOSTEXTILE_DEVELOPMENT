const User = require('../../model/login/login');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendToken = require('../../utils/jwttokentocookie');
const sendEmail = require('../../utils/pwdresetmail');
const crypto = require('crypto');

// get All user => /api/users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    let users;

    try{
        users = await User.find()
    }catch(err){
        console.log(err.message);
    }

    if(!users){
        return next(new ErrorHandler('Users not found', 400));
    }

    let userlocation = users.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data.assignbusinessid == req.body.businessid
        }
        // }else{
        //     if(req.body.userlocation.includes(data.))
        // }
    })

    return res.status(200).json({
        userlocation,
        users});
})

// get All user => /api/userstermsfalse
exports.getAllUsersTermsFalse = catchAsyncErrors(async (req, res, next) => {
    let usersterms;

    try{
        usersterms = await User.find({assignbusinessid: req.body.businessid,termscondition:false})

    }catch(err){
        console.log(err.message);
    }

    if(!usersterms){
        return next(new ErrorHandler('Users not found', 400));
    }

    return res.status(200).json({usersterms});
})

// get All user with terms true => /api/userstermstrue
exports.getAllUsersTermsTrue = catchAsyncErrors(async (req, res, next) => {
    let usersterms;
    let result;

    try{
        result = await User.find()
        usersterms = result.filter((data, index)=>{
            return data.termscondition == true
        })
    }catch(err){
        console.log(err.message);
    }

    if(!result){
        return next(new ErrorHandler('Users not found', 400));
    }

    return res.status(200).json({usersterms});
})

exports.getAllUsersTermsFalseLocation = catchAsyncErrors(async (req, res, next) => {
    let result;
    let users;

    try{
        result = await User.find({assignbusinessid: req.body.businessid,termscondition:false},{staffname:1,email:1,role:1})

        users = result.filter((data,index)=>{
            if(req.body.role == 'Admin'){
                return data
            }else if(req.body.userassignedlocation.includes(data.businesslocation)){
              return data
            }
        });

        if(!users){
            return next(new ErrorHandler('Users not found', 400));
        }
    
        return res.status(200).json({users});
    
    }catch(err){
        console.log(err.message);
    }
})

// check the value is already used for role delete
exports.getAllUserRole = catchAsyncErrors(async (req, res, next) => {
    let users;
    try {
        users = await User.find({assignbusinessid: req.body.businessid, role: req.body.checkrole,})        
    }
    catch (err) {
        console.log(err.message);
    }
    if (!users) {
        return next(new ErrorHandler('User not found!', 404));
    }
    return res.status(200).json({
        users
    });
})

// check the value is already used for department delete
exports.getAllUserDepartment = catchAsyncErrors(async (req, res, next) => {
    let users;
    try {
        users = await User.find({assignbusinessid: req.body.businessid, department: req.body.checkdepartment,})        
    }
    catch (err) {
        console.log(err.message);
    }
    if (!users) {
        return next(new ErrorHandler('User not found!', 404));
    }
    return res.status(200).json({
        users
    });
})

// check the value is already used for exp location delete
exports.getAllUserLocation = catchAsyncErrors(async (req, res, next) => {
    let users;
    try {
        users = await User.find({ assignbusinessid: req.body.businessid, businesslocation: { $in: [req.body.checklocationid] }})        
    }
    catch (err) {
        console.log(err.message);
    }
    if (!users) {
        return next(new ErrorHandler('User not found!', 404));
    }
    return res.status(200).json({
        users
    });
})

// register from user module => api/user/new
exports.regUser = catchAsyncErrors( async (req, res, next) =>{
    const { companyname,email,password, cpassword,entrynumber,role, date, businesslocation, department, roel,
        userid, dateofjoin, staffname, fathername,counter, gender, bloodgroup, dateofbirth, religion, nationality,address,areacity,pincode,
phonenum, otherphonenum, useractive, maritalstatus, familydetails,profileimage,educationdetails,experiencedetails,jobdetails,
languageknown, aadharnumber, accnumber, remarks, country, termscondition,state,assignbusinessid } = req.body;


    // encrypt password before saving
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)
    
    let user = await User.create({
        companyname,email,password:hashPassword, cpassword,entrynumber,role, date, businesslocation, department, roel,
        userid, dateofjoin, staffname, fathername,counter, gender, bloodgroup, dateofbirth, religion, nationality,address,areacity,pincode,
        phonenum, otherphonenum, useractive, maritalstatus, familydetails,profileimage,educationdetails,experiencedetails,jobdetails,
        languageknown, aadharnumber, accnumber, remarks, country, termscondition,state,assignbusinessid
    });

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });

    // sendToken(user, 200, res);

})
// register a user => api/auth/new
exports.regAuth = catchAsyncErrors( async (req, res, next) =>{

    const { companyname,email,password, cpassword,entrynumber, date,role, businesslocation, department, roel,
        userid, dateofjoin, staffname, fathername, gender,counter, bloodgroup, dateofbirth, religion, nationality,address,areacity,pincode,
phonenum, otherphonenum, useractive, maritalstatus, familydetails,profileimage,educationdetails,experiencedetails,jobdetails,
languageknown, aadharnumber, accnumber, remarks, country, termscondition,state,assignbusinessid } = req.body;
    // encrypt password before saving
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)
    
    const user = await User.create({
        companyname,email,password:hashPassword, cpassword,entrynumber,role, date, businesslocation, department, roel,
        userid, dateofjoin, staffname, fathername, gender,counter, bloodgroup, dateofbirth, religion, nationality,address,areacity,pincode,
phonenum, otherphonenum, useractive, maritalstatus, familydetails,profileimage,educationdetails,experiencedetails,jobdetails,
languageknown, aadharnumber, accnumber, remarks, country, termscondition,state,assignbusinessid

    })

    return res.status(201).json({ 
        success: true, 
        user 
    })

    // sendToken(user, 200, res);

})

// Login user => api/users
exports.loginAuth = catchAsyncErrors(async (req, res, next) =>{
    const { email, password } = req.body;

    // check if email & password entered by user
    if(!email || !password ){
        return next(new ErrorHandler('Please Enter Password', 400));
    }

    // Finding if user exists in database
    const user = await User.findOne({ email }).select('+password');

    if(!user){
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // If checks password is correct or not
    const isPwdMatched = await bcrypt.compare(password, user.password);

    if(!isPwdMatched){
        return next(new ErrorHandler('Invalid Password', 401));
    }

    // res.status(200).json({
    //     success: true,
    //     token: generateToken(user._id) 
    // })

    sendToken(user, 200, res);
})

// Forgot password => api/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) =>{

    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return next(new ErrorHandler('User not found with this email', 404));
    }

    //get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false});

    //create reset url
    const resetUrl = `${req.protocol}://${req.get('host')}/api/password/reset/${resetToken}`;

    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it`;

    try{

        await sendEmail({
            email: user.email,
            subject: 'HIPOS Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email send to: ${user.email}`
        })

    }catch(err){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(err.message, 500))
    }
})

// Reset password => /api/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    //hash url token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired!', 400))
    }

    if(req.body.password !== req.body.cpassword){
        return next(new ErrorHandler('Passwords does not match', 400))
    }

    // encrypt password before saving
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    //setup new password
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
})

// Logout user => api/authout
exports.loginOut = catchAsyncErrors(async (req, res, next) =>{

    res.cookie('token', null,{
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'Logged out!'
    })

});

// get Signle user => /api/auth/:id
exports.getSingleUser = catchAsyncErrors(async (req, res, next)=>{

    const suser = await User.findById(req.params.id);

    if (!suser) {
        return next(new ErrorHandler('User not found', 404));
    }

    return res.status(200).json({
        success: true,
        suser
    })
})


// update user by id => /api/userpw/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const { companyname,email,password, cpassword,entrynumber,role, date, businesslocation, department, roel,
        userid, dateofjoin, staffname, fathername, gender,counter, bloodgroup, dateofbirth, religion, nationality,address,areacity,pincode,
phonenum, otherphonenum, useractive, maritalstatus, familydetails,profileimage,educationdetails,experiencedetails,jobdetails,
languageknown, aadharnumber, accnumber, remarks, country, termscondition,state, assignbusinessid} = req.body;

        
    // encrypt password before saving
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const upuser = await User.findByIdAndUpdate(id, { companyname,email,password:hashPassword, cpassword,entrynumber,role, date, businesslocation, department, roel,
        userid, dateofjoin, staffname, fathername, gender,counter, bloodgroup, dateofbirth, religion, nationality,address,areacity,pincode,
phonenum, otherphonenum, useractive, maritalstatus, familydetails,profileimage,educationdetails,experiencedetails,jobdetails,
languageknown, aadharnumber, accnumber, remarks, country, termscondition,state, assignbusinessid
});

    if (!upuser) {
        return next(new ErrorHandler('User not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully!'})
})

// update user by id => /api/auth/:id
exports.updateUserpw = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const upuser = await User.findByIdAndUpdate(id, req.body);

    if (!upuser) {
        return next(new ErrorHandler('User not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully!'})
})

// delete user by id => /api/auth/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    const duser = await User.findByIdAndRemove(id);

    if (!duser) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({ message: 'Deleted successfully'})
})

