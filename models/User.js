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
    phone_number: {
        type: String,
        required: true,
        maxlength: 20,

    },
    profile_picture: {
        type: String,

    },
    password: {
        type: String,
        required: true

    },
    password_reset_code: {
        type: String,
    },
    email_verification_code: {
        type: String,
    },
    type: {
        type: Number,
        required: true,
    },
    active: {
        type: Number,
    },
    created_on: {
        type: Date,
        default: moment().format('YYYY-MM-DD')
    },
    modified_on: {
        type: Date,
        default: moment().format('YYYY-MM-DD')
    },

});

userSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret, options) => {
    ret.created_on = moment(ret.created_on).format('YYYY-MM-DD');
    ret.modified_on = moment(ret.modified_on).format('YYYY-MM-DD');
    return ret;
  }
});

const User = mongoose.model("users", userSchema);

module.exports = User;