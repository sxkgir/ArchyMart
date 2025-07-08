const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {type: String, required:true},
    rin:{type:Number, required:true},
    email: {type: String, required: true},
    RCSID: {type: String, required: true},
    role: { type: String, enum: ["student", "staff", "admin"], default: "student" },

},{ timestamps: true } );

module.exports = mongoose.model("User", userSchema);