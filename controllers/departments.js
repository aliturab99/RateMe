const express = require("express");
const mongoose = require("mongoose")
const Department = require("../models/Department")
const User = require("../models/User")
const moment = require("moment/moment");
const verifyuser = require("../middlewares/auth")
const { userTypes } = require("../utils/utils")


const router = express.Router();
router.use(verifyuser);



router.post("/add", async (req, res) => {

    try {

        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN)
            throw new Error("Invalid Request")


        const {
            name,
            email,
            phone,
            logo,
            address,
            user_id
        } = req.body;

        const department = Department({
            name,
            email,
            phone,
            logo,
            address,
            user_id
        });
        await department.save();
        res.json({ department });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})



//Edit Department
router.post("/edit", async (req, res) => {

    try {
        // if id is not available
        if (!req.body.id)
            throw new Error("Department Id is invalid")

        // check for the valid id


        // check for valid object Id using mongoose this will check the id is this id is according to formula of #
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("Invalid Id");


        const department = await Department.findById(req.body.id)
        if (!department)
            throw new Error("Invalid Id");

        //check that person is editing his own assigned department
        if ( req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN && req.user._id.toString() !== department.user_id.toString())
            throw new Error("Invalid request");


        const {
            name,
            email,
            phone,
            logo,
            address,
        } = req.body;

        const updatedDepartment = await Department.findByIdAndUpdate(req.body.id, {
            name,
            email,
            phone,
            logo,
            address,
        });
        updatedDepartment.save()
        res.json({ department: updatedDepartment })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})


// //Delete Users
router.delete('/delete', async (req, res) => {
    try {
        //  if id is not available
        if (!req.body.id)
            throw new Error("Department Id is invalid")


        // check for valid object Id using mongoose this will check the id is this id is according to formula of #
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("Invalid Id");
            
        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN)
        throw new Error("Invalid Request")

        const department = await Department.findById(req.body.id)
            if (!department)
                throw new Error("Invalid Id");

        //check that person is editing his own assigned department
        if (req.user._id.toString() !== department.user_id.toString())
            throw new Error("Invalid request");


        await Department.findByIdAndDelete(req.body.id)
        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.get("/", async (req, res) => {
    try {
        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN)
        throw new Error("Invalid Request")
        
        let department = await Department.find()
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router;