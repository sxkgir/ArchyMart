const mongoose = require("mongoose");

const staffSchema =  mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    role: {type: String, required: true},
    verificationToken: {type : String},
    tokenExpires: {type: Date},
});

module.exports = mongoose.model("Staff", staffSchema, "staff");