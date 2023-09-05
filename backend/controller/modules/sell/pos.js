const Pos = require('../../../model/modules/sell/pos');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const moment = require('moment');
  //  Datefield
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;

// get All sales => /api/products
exports.getAllPos = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result;
    try{
        result = await Pos.find({assignbusinessid: req.body.businessid})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Sale not found!', 404));
    }
    
    pos1 = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })
    
    return res.status(200).json({
        pos1
    });
})

exports.getAllPosSales = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result;
    try{
        result = await Pos.find({assignbusinessid: req.body.businessid},{date:1,referenceno:1,businesslocation:1,customer:1,contactnumber:1,aftergranddisctotal:1,totalitems:1,userbyadd:1})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Sale not found!', 404));
    }
    
    pos1 = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })
    
    return res.status(200).json({
        pos1
    });
})

// get All sales today => /api/products
exports.getAllTodayPos = catchAsyncErrors(async (req, res, next) => {
    let pos1;
    let result;
    try{
        result = await Pos.find({assignbusinessid: req.body.businessid,today:today})
    }catch(err){
        console.log(err.message);
    }
    if(!result){
        return next(new ErrorHandler('Sale not found!', 404));
    }
    
    pos1 = result.filter((data,index)=>{
        if(req.body.role == 'Admin'){
            return data
        }else if(req.body.userassignedlocation.includes(data.businesslocation)){
          return data
        }
    })
    
    return res.status(200).json({
        pos1
    });
})

exports.getWeeklySale = catchAsyncErrors(async (req, res, next) => {

    const previousWeekDates = [];
    const currentDate = new Date();
    for (let i = 1; i <= 7; i++) {
        const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 + i);
        previousWeekDates.push(moment(previousDate).utc().format('YYYY-MM-DD'));
    }
    const { businessid, islocation, location } = req.body

    let result;
    let resultlocation
    let weeklyreport
    try {
        result = await Pos.find({ assignbusinessid: businessid, today: { $in: previousWeekDates } });
        resultlocation = await Pos.find({ assignbusinessid: businessid, businesslocation: location, today: { $in: previousWeekDates } });

    } catch (err) {
        console.log(err.message);
    }
    if (!result) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    weeklyreport = islocation ? resultlocation : result

    return res.status(200).json({
        weeklyreport
    });
})

const colors2 =  ["#77C2FE", "#249CFF", "#1578CF", "#0A579E", "#003870"];

exports.getCurrentTopFiveCustomers = catchAsyncErrors(async (req, res, next) => {
    try {
        const { businessid, islocation, location } = req.body;

      

        // Get the current month number (1 to 12)
        const getcmonth = new Date();
        const getmonthnum = getcmonth.getMonth() + 1;

        const pipelineLocation = [
            {
                $match: {
                    assignbusinessid: businessid,
                    businesslocation:location,
                    $expr: {
                        $eq: [{ $month: { $toDate: "$today" } }, getmonthnum]
                    }
                }
            },
            {
                $unwind: "$goods"
            },
            {
                $group: {
                    _id: "$customer",
                    totalQuantity: { $sum: "$goods.subtotal" }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    y: "$totalQuantity"
                }
            },
            {
                $sort: { y: -1 }
            },
            {
                $limit: 5
            }
        ];

        // Prepare the aggregation pipeline based on the 'islocation' flag
        const pipeline = [
            {
                $match: {
                    assignbusinessid: businessid,
                    $expr: {
                        $eq: [{ $month: { $toDate: "$today" } }, getmonthnum]
                    }
                }
            },
            {
                $unwind: "$goods"
            },
            {
                $group: {
                    _id: "$customer",
                    totalQuantity: { $sum: "$goods.subtotal" }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    y: "$totalQuantity"
                }
            },
            {
                $sort: { y: -1 }
            },
            {
                $limit: 5
            }
        ];

        // Execute the pipeline based on 'islocation' flag
        const sales = islocation
            ? await Pos.aggregate([pipelineLocation])
            : await Pos.aggregate(pipeline);

        // Add colors to each object in the result array
        const resultWithColors = sales.map((item, index) => ({
            ...item,
            color: colors2[index % colors2.length] // Assign colors cyclically from the colors array
        }));

        return res.status(200).json({
            sales: resultWithColors
        });
    } catch (err) {
        console.log(err.message);
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});


exports.getTopFiveProdTable = catchAsyncErrors(async (req, res, next) => {
    try {
        const { businessid, islocation, location } = req.body;

        // Get the current month number (1 to 12)
        const getcmonth = new Date();
        const getmonthnum = getcmonth.getMonth() + 1;


        // Prepare the aggregation pipeline for all locations
        const pipelineAllLocations = [
            {
                $match: {
                    assignbusinessid: businessid,
                    $expr: {
                        $eq: [{ $month: { $toDate: "$today" } }, getmonthnum]
                    }
                }
            },
            {
                $unwind: "$goods"
            },
            {
                $group: {
                    _id: "$goods.productname",
                    totalQuantity: { $sum: "$goods.quantity" }
                }
            },
           
            {
                $sort: { totalQuantity: -1 }
            },
            {
                $limit: 5
            }
        ];

        // Prepare the aggregation pipeline for a specific location
        const pipelineSpecificLocation = [
            {
                $match: {
                    assignbusinessid: businessid,
                    businesslocation: location,
                    $expr: {
                        $eq: [{ $month: { $toDate: "$today" } }, getmonthnum]
                    }
                }
            },
            {
                $unwind: "$goods"
            },
            {
                $group: {
                    _id: "$goods.productname",
                    totalQuantity: { $sum: "$goods.quantity" }
                }
            },
            {
                $sort: { totalQuantity: -1 }
            },
            {
                $limit: 5
            }
        ];

        // Execute the appropriate pipeline based on 'islocation' flag
        const sales = islocation
            ? await Pos.aggregate(pipelineSpecificLocation)
            : await Pos.aggregate(pipelineAllLocations);

     

        // Add colors to each object in the result array
        const resultWithColors = sales.map((item, index) => ({
            ...item,
            color: colors[index % colors.length] // Assign colors cyclically from the colors array
        }));

        return res.status(200).json({
            sales: resultWithColors
        });
    } catch (err) {
        console.log(err.message);
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});





const colors = ["#97A1D9", "#6978C9", "#4A5596", "#2C3365", "#111539"];



exports.getCurrentTopFiveProducts = catchAsyncErrors(async (req, res, next) => {
    try {
        const { businessid, islocation, location } = req.body;

        // Get the current month number (1 to 12)
        const getcmonth = new Date();
        const getmonthnum = getcmonth.getMonth() + 1;


        // Prepare the aggregation pipeline for all locations
        const pipelineAllLocations = [
            {
                $match: {
                    assignbusinessid: businessid,
                    $expr: {
                        $eq: [{ $month: { $toDate: "$today" } }, getmonthnum]
                    }
                }
            },
            {
                $unwind: "$goods"
            },
            {
                $group: {
                    _id: "$goods.productname",
                    totalQuantity: { $sum: "$goods.quantity" }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    y: "$totalQuantity"
                }
            },
            {
                $sort: { y: -1 }
            },
            {
                $limit: 5
            }
        ];

        // Prepare the aggregation pipeline for a specific location
        const pipelineSpecificLocation = [
            {
                $match: {
                    assignbusinessid: businessid,
                    businesslocation: location,
                    $expr: {
                        $eq: [{ $month: { $toDate: "$today" } }, getmonthnum]
                    }
                }
            },
            {
                $unwind: "$goods"
            },
            {
                $group: {
                    _id: "$goods.productname",
                    totalQuantity: { $sum: "$goods.quantity" }
                }
            },
            {
                $project: {
                    _id: 0,
                    label: "$_id",
                    y: "$totalQuantity"
                }
            },
            {
                $sort: { y: -1 }
            },
            {
                $limit: 5
            }
        ];

        // Execute the appropriate pipeline based on 'islocation' flag
        const sales = islocation
            ? await Pos.aggregate(pipelineSpecificLocation)
            : await Pos.aggregate(pipelineAllLocations);

     

        // Add colors to each object in the result array
        const resultWithColors = sales.map((item, index) => ({
            ...item,
            color: colors[index % colors.length] // Assign colors cyclically from the colors array
        }));

        return res.status(200).json({
            sales: resultWithColors
        });
    } catch (err) {
        console.log(err.message);
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});



exports.getTotalSales = catchAsyncErrors(async (req, res, next) => {
    const { startdate, enddate, islocation, location } = req.body

    let salesall;
    let result;
    try {
        result = await Pos.find({ assignbusinessid: req.body.businessid,today: { $gte: startdate, $lte: enddate }})
        resultlocation = await Pos.find({ assignbusinessid: req.body.businessid,businesslocation: location,today: { $gte: startdate, $lte: enddate }})
    
        if (!result) {
            return next(new ErrorHandler('Data not found!', 404));
        }
    
        salesall = islocation ? resultlocation : result
        return res.status(200).json({
            salesall
        });

    } catch (err) {
        console.log(err.message);
    }
})

// Create new product => /api/product/new
exports.addPos = catchAsyncErrors(async (req, res, next) =>{
   let aproduct = await Pos.create(req.body)

    return res.status(200).json({ 
        message: 'Successfully added!' 
    });
})
// get Signle product => /api/product/:id
exports.getSinglePos = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let spos = await Pos.findById(id);

    if(!spos){
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({
        spos
    })
})
// update product by id => /api/product/:id
exports.updatePos = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upos = await Pos.findByIdAndUpdate(id, req.body);

    if (!upos) {
      return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({message: 'Updated successfully' });
})
// delete product by id => /api/product/:id
exports.deletePos = catchAsyncErrors(async (req, res, next)=>{
    const id = req.params.id;

    let dpos = await Pos.findByIdAndRemove(id);

    if(!dpos){
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({message: 'Deleted successfully'});
})


// check the value is already used for customer delete
exports.getAllPosCustomer = catchAsyncErrors(async (req, res, next) => {
    let pos;
    try {
        pos = await Pos.find({ assignbusinessid: req.body.businessid, customer: req.body.checkcustomer, })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!pos) {
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({
        pos
    });
})

// check the value is already used for location delete
exports.getAllPosLocation = catchAsyncErrors(async (req, res, next) => {
    let pos;
    try {
        pos = await Pos.find({ assignbusinessid: req.body.businessid, businesslocation: req.body.checklocationid, })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!pos) {
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({
        pos
    });
})

// check the value is already used for product delete
exports.getAllPosProduct = catchAsyncErrors(async (req, res, next) => {
    let pos;
    try {
        pos = await Pos.find({
            assignbusinessid: req.body.businessid,
            goods: {
                $elemMatch: {
                    productid: req.body.checksku,
                }
            },
        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!pos) {
        return next(new ErrorHandler('Sale not found!', 404));
    }
    return res.status(200).json({
        pos
    });
})

// check the value is already used for taxrate delete
exports.getAllPosTaxrate = catchAsyncErrors(async (req, res, next) => {
    let pos;

    try {
        pos = await Pos.find({
            assignbusinessid: req.body.businessid,
            goods: {
                $elemMatch: {
                    $or: [
                        { applicabletax: req.body.checktaxrates },
                        { applicabletax: req.body.checkhsn },
                    ]
                }
            },

        })
    }
    catch (err) {
        console.log(err.message);
    }
    if (!pos) {
        return next(new ErrorHandler('Sale not found!', 404));
    }

    return res.status(200).json({
        pos
    });
})
