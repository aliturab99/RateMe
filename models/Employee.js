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
    phone_number: {
        type: String,
        maxlength: 20,
    },
    id_card: {
        type: String,
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId
    },
    profile_picture: {
        type: String,
    },
    designation: {
        type: String,
    },
    rating: {
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


const Employee = mongoose.model("employees", employeeSchema);

module.exports = Employee;