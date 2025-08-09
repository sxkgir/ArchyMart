const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
    orderID: {type: String, unique: true, required: true},
    orderedBy: {type: mongoose.Schema.Types.ObjectId, ref:"Student", required:true},
    items: [{
        productID: { type: String, required: true }, // still useful for reference
        productName: { type: String, required: true }, // snapshot at time of order
        category:{type: String, required: true},
        sizeID: { type: Number},
        qty: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
    }],
    totalPrice: {type: Number, required: true},
    datePlaced: {type: Date, default: Date.now, required: true},
    confirmed: {type: Boolean, required: true, default: false},
    confirmedDate: {type: Date}
},{ versionKey: false })

module.exports = mongoose.model("Orders", ordersSchema, "orders")