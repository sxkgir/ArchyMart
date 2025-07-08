const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    productID: {type: String, required: true},
    productName: {type: String, required:true},
    stock: {type: Number, required: true},
    categoryID:{type: String, required:true },
    avaliblity:{type:Boolean, required:true},
    purchasePrice:{type:Number, required:true},
    dateAdded:{type:String, required:false},
    dateRemoved:{type:String, required:false},
})

module.exports = mongoose.model("Products",productSchema);
