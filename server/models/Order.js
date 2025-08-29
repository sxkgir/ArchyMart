const mongoose = require("mongoose");

const ordersSchema = mongoose.Schema({
    orderID: {type: String, unique: true, required: true},
    formID:{type: String, default: ""},
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
    status: {type: String, required: true, default: "pending"},
    confirmedDate: {type: Date}
},{ versionKey: false })

ordersSchema.index({ orderedBy: 1 });          
ordersSchema.index({ formID: 1})
ordersSchema.index({ datePlaced: -1 });       // Sort/filter by date
ordersSchema.index({ status: 1 });            // Filter by status (pending/confirmed)
ordersSchema.index({ totalPrice: 1 })
ordersSchema.index({ orderedBy: 1, datePlaced: -1 });
ordersSchema.index({ status: 1, datePlaced: -1 }); // useful for staff filters + sort

module.exports = mongoose.model("Orders", ordersSchema, "orders")