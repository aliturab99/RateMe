const mongoose = require("mongoose")
const moment = require("moment/moment");

const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        maxlength: 20,

    },
    logo: {
        type: String,

    },
    address: {
        type: String,
    },

    rating: {
        type: Number,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId
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

departmentSchema.set('toJSON', {
  getters: true,
  transform: (doc, ret, options) => {
    ret.created_on = moment(ret.created_on).format('YYYY-MM-DD');
    ret.modified_on = moment(ret.modified_on).format('YYYY-MM-DD');
    return ret;
  }
});

const Department = mongoose.model("departments", departmentSchema);

module.exports = Department;