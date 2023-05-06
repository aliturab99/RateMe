const mongoose = require("mongoose")
const moment = require("moment/moment");

const employeeSchema = new mongoose.Schema({
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
        maxlength: 20,
    },
    idCard: {
        type: String,
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId
    },
    profilePicture: {
        type: String,
    },
    designation: {
        type: String,
    },
    rating: {
        type: Number,
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


const Employee = mongoose.model("employees", employeeSchema);

module.exports = Employee;