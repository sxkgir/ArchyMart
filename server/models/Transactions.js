const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    transactionID: {type: String, required: true},
    studentID: {type: String, required:true},
    productName: {type: String, required: true},
    numUnits: {type:Number, required:true},
    transactionDate:{type: String, required:true },
    printed: {type:Boolean, required:true},
    printedDate:{type:String, required:true},
    amount:{type:Number, required:true},
})

module.exports = mongoose.model("Products",productSchema);
