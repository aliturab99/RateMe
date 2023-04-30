const mongoose = require("mongoose")
const moment = require("moment/moment");

const departmentSchema = new mongoose.Schema({
    department_name: {
        type: String,
        required: true
    },
    department_email: {
        type: String,
        required: true
    },
    department_phone: {
        type: String,
        maxlength: 20,

    },
    department_logo: {
        type: String,

    },
    depaerment_address: {
        type: String,

    },
    assigned_to: {
        type: String,
    },
    average_rating: {
        type: String,
    },
    active: {
        type: Number,
    },
    created_on: {
        type: Date,
        default: moment().format('YYYY-MM-DD')
    },
    modified_by: {
        type: string,
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