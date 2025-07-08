const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Product");
const User    = require("../models/User");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database")
        if (process.env.NODE_ENV !== "production") {
        await Promise.all([User.deleteMany(), Product.deleteMany()]);
  }
    }
    catch(err){
        console.error("Failed to connect to Database", err);
        throw err; 

    }
    
}

module.exports = {
    connectDB,
}