const mongoose = require("mongoose")
const moment = require("moment/moment");
const { userTypes } = require("../utils/utils");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        maxlength: 20,
    },
    profilePicture: {
        type: String,
    },
    password: {
        type: String,
    },
    passwordResetCode: {
        type: String,
    },
    type: {
        type: Number,
        required: true,
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId
    },
    createdOn: {
        type: Date,
        default: moment().format('YYYY-MM-DD')
    },
    modifiedOn: {
        type: Date,
        default: moment().format('YYYY-MM-DD')
    },

});


const User = mongoose.model("users", userSchema);

module.exports = User;