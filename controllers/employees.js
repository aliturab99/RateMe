const express = require("express");
const mongoose = require("mongoose")
const Employee = require("../models/Employee")
const User = require("../models/User")
const moment = require("moment/moment");
const verifyuser = require("../middlewares/auth")
const { userTypes } = require("../utils/utils");
const Department = require("../models/Department");


const router = express.Router();
router.use(verifyuser);



router.post("/add", async (req, res) => {

    try {

        if (req.user.type !== userTypes.USER_TYPE_STANDARD_ADMIN)
            throw new Error("Invalid Request")

        const department = await Department.findOne({ user_id: req.user._id });
        if (!department)
            throw new Error("Department does not exsist")

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("Invalid Request")

        const {
            name,
            email,
            phone_number,
            id_card,
            department_id,
            profile_picture,
            designation,
            rating,
            type
        } = req.body;

        const employee = Employee({
            name,
            email,
            phone_number,
            id_card,
            department_id,
            profile_picture,
            designation,
            rating,
            type
        });
        await employee.save();
        res.json({ employee });
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

        const department = await Department.findOne({ user_id: req.user._id });
        if (!department)
            throw new Error("Department does not exsist")

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("Invalid Request 2")

        // check for valid object Id using mongoose this will check the id is this id is according to formula of #
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("Invalid Id");

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("Invalid request 3");

        const employee = await Employee.findById(req.body.id)
        if (!employee)
            throw new Error("Invalid Id");


        //check that Standard admin is updating the data of his own department's employees
        console.log(department._id)
        console.log(employee.department_id)
        if (department._id.toString() !== employee.department_id.toString())
            throw new Error("Invalid request 4");


        
        await Employee.updateOne(
            {_id: employee._id, department_id: department._id},
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
router.get("/details/:employee_id", async (req, res) => {


    try {
        // if id is not available
        if (!req.params.employee_id)
            throw new Error("Employee Id is invalid")



        if (req.user.type !== userTypes.USER_TYPE_STANDARD_ADMIN)
            throw new Error("Invalid Request 1")


        // check for the valid id

        const department = await Department.findOne({ user_id: req.user._id });
        if (!department)
            throw new Error("Department does not exsist")

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("Invalid Request 2")

        // check for valid object Id using mongoose this will check the id is this id is according to formula of #
        if (!mongoose.isValidObjectId(req.params.employee_id))
            throw new Error("Invalid Id");

        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("Invalid request 3");

        const employee = await Employee.findById(req.params.employee_id)
        if (!employee)
            throw new Error("Invalid Id");


        //check that Standard admin is updating the data of his own department's employees
        console.log(department._id)
        console.log(employee.department_id)
        if (department._id.toString() !== employee.department_id.toString())
            throw new Error("Invalid request 4");


        
        res.json(employee)

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// //Delete Users
router.delete('/delete', async (req, res) => {
    try {
      // if id is not available
      if (!req.body.id)
      throw new Error("Employee Id is invalid")



  if (req.user.type !== userTypes.USER_TYPE_STANDARD_ADMIN)
      throw new Error("Invalid Request 1")


  // check for the valid id

  const department = await Department.findOne({ user_id: req.user._id });
  if (!department)
      throw new Error("Department does not exsist")

  if (req.user._id.toString() !== department.user_id.toString())
      throw new Error("Invalid Request 2")

  // check for valid object Id using mongoose this will check the id is this id is according to formula of #
  if (!mongoose.isValidObjectId(req.body.id))
      throw new Error("Invalid Id");

  if (req.user._id.toString() !== department.user_id.toString())
      throw new Error("Invalid request 3");

  const employee = await Employee.findById(req.body.id)
  if (!employee)
      throw new Error("Invalid Id");


  //check that Standard admin is updating the data of his own department's employees
  console.log(department._id)
  console.log(employee.department_id)
  if (department._id.toString() !== employee.department_id.toString())
      throw new Error("Invalid request 4");

    
        await Employee.deleteOne({ _id: req.body.id, department_id: department._id })

        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.post("/search", async (req, res) => {
    try {

   if (req.user.type !== userTypes.USER_TYPE_STANDARD_ADMIN)
       throw new Error("Invalid Request 1")


   // check for the valid id

   const department = await Department.findOne({ user_id: req.user._id });
   if (!department)
       throw new Error("Department does not exsist")

   if (req.user._id.toString() !== department.user_id.toString())
       throw new Error("Invalid Request 2")


   if (req.user._id.toString() !== department.user_id.toString())
       throw new Error("Invalid request 3");


        let employeeList = await Employee.find(req.body)
        res.status(200).json(employeeList);
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router;