const express = require("express");
const mongoose = require("mongoose")
const Employee = require("../models/Employee")
const User = require("../models/User")
const moment = require("moment/moment");
const { verifyuser } = require("../middlewares/auth")
const { userTypes } = require("../utils/utils");
const Department = require("../models/Department");
const Rating = require("../models/Rating");
const multer = require("multer")
const fs = require('fs').promises;
const path = require("path")


const router = express.Router();


router.use(["/add", "/edit", "/delete", "/details/:employeeId", "/search"], verifyuser);

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await fs.mkdir(`content/${req.body.deptId}/`, { recursive: true });
            cb(null, `content/${req.body.deptId}/`)
        } catch (err) {
            cb(err, null)
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['jpg', "gif", "png", "bmp", 'jpeg']
        const ext = path.extname(file.originalname).replace(".", "")
        if (allowedTypes.includes(ext)) {
            cb(null, true)
        }
        else {
            cb((new Error("File is Not Allowed")), false)
        }
    }
})



router.post("/add", upload.single("profilePicture"), async (req, res) => {

    try {

        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN && req.body.deptId !== req.user.departmentId.toString())
            throw new Error("Invalid Request")

        const department = await Department.findById(req.body.deptId);
        if (!department)
            throw new Error("Department does not exsist")

        const {
            name,
            email,
            phone,
            cnic,
            designation
        } = req.body;

        const employee = Employee({
            name,
            email,
            phone,
            cnic,
            profilePicture: req.file ? req.file.filename : "",
            designation,
            departmentId: department._id,
            createdOn: new Date(),
            modifiedOn: new Date()
        });
        await employee.save();
        res.json({ success: true });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})



//Edit Employee
router.post("/edit", async (req, res) => {


    try {
        // if id is not available
        if (!req.body.id)
            throw new Error("Employee Id is invalid")



        if (req.user.type !== userTypes.USER_TYPE_STANDARD_ADMIN)
            throw new Error("Invalid Request 1")


        // check for the valid id

        const department = await Department.findOne({ userId: req.user._id });
        if (!department)
            throw new Error("Department does not exsist")

        if (req.user._id.toString() !== department.userId.toString())
            throw new Error("Invalid Request 2")

        // check for valid object Id using mongoose this will check the id is this id is according to formula of #
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("Invalid Id");

        if (req.user._id.toString() !== department.userId.toString())
            throw new Error("Invalid request 3");

        const employee = await Employee.findById(req.body.id)
        if (!employee)
            throw new Error("Invalid Id");


        //check that Standard admin is updating the data of his own department's employees

        if (department._id.toString() !== employee.departmentId.toString())
            throw new Error("Invalid request 4");



        await Employee.updateOne(
            { _id: employee._id, departmentId: department._id },
            { $set: req.body }
        );

        const updatedEmployee = await Employee.findById(req.body.id);
        updatedEmployee.save()
        res.json({ employee: updatedEmployee })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

//Edit Employee
router.get("/details/:employeeId", async (req, res) => {


    try {
        // if id is not available
        if (!req.params.employeeId)
            throw new Error("Employee Id is invalid")



        if (req.user.type !== userTypes.USER_TYPE_STANDARD_ADMIN)
            throw new Error("Invalid Request 1")


        // check for the valid id

        const department = await Department.findOne({ userId: req.user._id });
        if (!department)
            throw new Error("Department does not exsist")

        if (req.user._id.toString() !== department.userId.toString())
            throw new Error("Invalid Request 2")

        // check for valid object Id using mongoose this will check the id is this id is according to formula of #
        if (!mongoose.isValidObjectId(req.params.employeeId))
            throw new Error("Invalid Id");

        if (req.user._id.toString() !== department.userId.toString())
            throw new Error("Invalid request 3");

        const employee = await Employee.findById(req.params.employeeId)
        if (!employee)
            throw new Error("Invalid Id");


        //check that Standard admin is updating the data of his own department's employees
        if (department._id.toString() !== employee.departmentId.toString())
            throw new Error("Invalid request 4");



        res.json(employee)

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// //Delete Users
router.post('/delete', async (req, res) => {
    try {
        // if id is not available
        if (!req.body.id)
            throw new Error("Employee Id is invalid")
        // check for valid object Id using mongoose this will check the id is this id is according to formula of #
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("Invalid Id");
        const employee = await Employee.findById(req.body.id)
        if (!employee)
            throw new Error("Invalid Id");
        
        if(req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN && employee.departmentId.toString() !== req.user.departmentId.toString())
            throw new Error("invalid Request")

        await Employee.findByIdAndDelete(req.body.id)
        if(employee.profilePicture) await fs.unlink(`content/${employee.departmentId}/${employee.profilePicture}}`)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.post("/search", async (req, res) => {
    try {

        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN && req.user.departmentId.toString() !== req.body.deptId)
            throw new Error("Invalid Request 1")

        const department = await Department.findById(req.body.deptId);
        if (!department)
            throw new Error("Department does not exsist")

        const conditions = {departmentId: req.body.deptId};

        let employees = await Employee.find(conditions)
        res.status(200).json({employees, department});
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.post("/feedback", async (req, res) => {

    try {


        const {
            name,
            phoneNumber,
            feedbackText,
            employeeId,
            rating,
        } = req.body;

        const employee = await Employee.findById(employeeId)
        if (!employee)
            throw new Error("Invalid Id");

        if (rating < 0 || rating > 5)
            throw new Error("Invalid Request")

        const ratingData = Rating({
            name,
            phoneNumber,
            feedbackText,
            departmentId: employee.departmentId,
            employeeId,
            rating,
        })
        await ratingData.save()
        res.json({ ratingData })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }

})

module.exports = router;