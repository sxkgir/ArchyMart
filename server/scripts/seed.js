const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("../models/Products");
const User    = require("../models/Users");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connected to Database")
    }       
    catch(err){
        console.error("Failed to connect to Database", err);
        throw err; 

    }
}



module.exports = {
    connectDB,
}