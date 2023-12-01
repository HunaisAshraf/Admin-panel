const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongoDB");
  } catch (error) {
    console.log(`error in monogDB connection ${error}`);
  }
};

module.exports = connectDB;
