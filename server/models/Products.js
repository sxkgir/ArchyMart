    const mongoose = require("mongoose");

    const productSchema = mongoose.Schema({
        productID: {type: Number, required: true},
        productName: {type: String, required:true},
        categoryName:{type: String, required:true },
        price:{type:Number, required:true},
        singleItem: {type: Boolean, required: true},
        availability:{type:Boolean, required:true},
        dateAdded:{type:String, required:false},
        dateRemoved:{type:String, required:false},
    })

    module.exports = mongoose.model("products",productSchema);
