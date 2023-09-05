const mongoose = require('mongoose');

const connectDb = async ()=>{
 
  try{
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`Database connected successfully: ${conn.connection.host}`);

  }catch(err){
    console.log(err.message);
    process.exit(1);

    // // unhandled promise rejection

    // process.on('unhandledRejection', err => {
    //   console.log(`ERROR: ${err.message}`);
    //   console.log('Shutting down due to unhandled promise rejection')
    //   server.close(() => {
    //     process.exit(1);
    //   })
    // })
  }

}

module.exports = connectDb;



// According to the documentation:

// -->unifiedtopology : DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, and will be removed in a future version. To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor.

// -->usenewurlparser : DeprecationWarning: current URL string parser is deprecated, and will be removed in a future version. To use the new parser, pass option { useNewUrlParser: true } to MongoClient.connect.