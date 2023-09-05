const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const connectDb = require('./config/connection');
const authRoute = require('./route/auth');
const userRoute = require('./route/user');
const contactRoute = require('./route/contact');
const expenseRoute = require('./route/expense');
const settingRoute = require('./route/settings');
const productRoute = require('./route/product');
const purchaseRoute = require('./route/purchase');
const passwordRoute = require('./route/password');
const sellRoute = require('./route/sell');
const transferRoute = require('./route/stock');
const errorMiddleware = require('./middleware/errorHandle');
const Cors = require('cors');
// Setting up config file
dotenv.config();

// Handle uncaught exceptions => hqandling undefined variables ..
    process.on('uncaughtException', err => {
      console.log(`ERROR: ${err.message}`);
      console.log('Shutting down due to uncaught exception')
      server.close(() => {
        process.exit(1);
      })
    })

// Connection to database mongodb
connectDb();

const app = express();

app.use(Cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "600mb" }));
app.use(bodyParser.urlencoded({ limit: "600mb", extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', authRoute,userRoute,contactRoute,expenseRoute,settingRoute,purchaseRoute,productRoute,sellRoute,transferRoute,passwordRoute);

// Handling middleware error
app.use(errorMiddleware);
const port = process.env.PORT || 8000
const env  = process.env.NODE_ENV;
const server = app.listen(port, ()=> console.log(`Server started at ${env} mode port ${port}`));

// unhandled promise rejection => for handling mongodb url errors

//     process.on('unhandledRejection', err => {
//       console.log(`ERROR: ${err.message}`);
//       console.log('Shutting down due to unhandled promise rejection')
//       server.close(() => {
//         process.exit(1);
//       })
//     })