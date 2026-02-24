const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();
const db_connect = async () => {
    const db_url = process.env.MONGOOSE_URL 
  try {
    await mongoose.connect(db_url)
    .then(()=>(console.log("db connected")
    ));
  } catch (error) {
    console.log("not connected" + error)
  }
};

module.exports= db_connect