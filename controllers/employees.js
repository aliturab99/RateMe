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


router.use(["/add", "/edit", "/delete", "/details/:employeeId", "/search", "/dashboard", "/rating"], verifyuser);

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
        const ext = path.extname(file.originalname)
        const newFileName = Math.random().toString(36).substring(2, 7);
        cb(null, newFileName + ext)
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
router.post("/edit", upload.single("profilePicture"), async (req, res) => {
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

        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN && employee.departmentId.toString() !== req.user.departmentId.toString())
            throw new Error("Invalid Request")

            const {
                name,
                email,
                phone,
                cnic,
                designation
            } = req.body;
    
            const record = {
                name,
                email,
                phone,
                cnic,
                designation,
                modifiedOn: new Date()
            };
            if(req.file && req.file.filename){
                record.profilePicture = req.file.filename
                if(employee.profilePicture && employee.profilePicture !== req.file.filename)
                    fs.access(`./content/${employee.departmentId}/${employee.profiePicture}`, require('fs').constants.F_OK).then( async () => {
                        await fs.unlink(`./content/${employee.departmentId}/${employee.profiePicture}`)
                    }).catch( err => {
                        console.log(err)
                    })
            }


        await Employee.findByIdAndUpdate(req.body.id, record)
        res.json({ success: true })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

//Details Employee
router.get("/details/:employeeId", async (req, res) => {


    try {
        // if id is not available
        if (!req.params.employeeId)
            throw new Error("Employee Id is invalid")
        if (!mongoose.isValidObjectId(req.params.employeeId))
            throw new Error("Invalid Id");


        const employee = await Employee.findById(req.params.employeeId)
        if (!employee)
            throw new Error("Invalid Id");

        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN && employee.departmentId.toString() !== req.user.departmentId.toString())
            throw new Error("Invalid Request")

        res.json({employee})

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

        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN && employee.departmentId.toString() !== req.user.departmentId.toString())
            throw new Error("invalid Request")

        await Employee.findByIdAndDelete(req.body.id)
        if (employee.profilePicture) await fs.unlink(`content/${employee.departmentId}/${employee.profilePicture}`)

        await Rating.deleteMany({employeeId: req.body.id})
        let result = await Rating.aggregate([
            {$match: {departmentId: { $eq: employee.departmentId }}},
            {$group: {_id: null, avg_value: {$avg: '$rating'}}}
        ]);
        if(result && result.length)
        {
            await Department.findByIdAndUpdate( employee.departmentId, {rating: result[0].avg_value.toFixed(1)})
        }else{
            await Department.findByIdAndUpdate( employee.departmentId, {rating: 0})
        }

        res.json({ success: true })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})


// Searching Route
router.post("/search", async (req, res) => {
    try {

        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN && req.user.departmentId.toString() !== req.body.deptId)
            throw new Error("Invalid Request 1")

        const department = await Department.findById(req.body.deptId);
        if (!department)
            throw new Error("Department does not exsist")

        const conditions = { departmentId: req.body.deptId };
        if(req.body.query)
        conditions['$text'] = { $search: req.body.query}
        const page = req.body.page ? req.body.page : 1;
        const skip = (page - 1) * process.env.RECORDS_PER_PAGE

        let employees = await Employee.find(conditions ,{_id: 1, name: 1, phone: 1, cnic: 1, departmentId: 1, profilePicture: 1}, {limit : process.env.RECORDS_PER_PAGE, skip})
        const totalEmployees = await Employee.countDocuments(conditions);
        const numOfPages = Math.ceil(totalEmployees / process.env.RECORDS_PER_PAGE)
        res.status(200).json({ employees, department, numOfPages });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})


// Rating For Profile
router.post("/rating", async (req, res) => {
    try {

        if (req.user.type !== userTypes.USER_TYPE_SUPER_ADMIN && req.user.departmentId.toString() !== req.body.deptId)
            throw new Error("Invalid Request 1")

        const conditions = { employeeId: req.body.employeeId };
        const page = req.body.page ? req.body.page : 1;
        const skip = (page - 1) * process.env.RECORDS_PER_PAGE

        let ratings = await Rating.find(conditions ,{_id: 1 ,name: 1, phone: 1, message: 1, rating: 1}, {limit : process.env.RECORDS_PER_PAGE, skip})
        const totalRatings = await Rating.countDocuments(conditions);
        const numOfPages = Math.ceil(totalRatings / process.env.RECORDS_PER_PAGE)
        res.status(200).json({ ratings,numOfPages });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})



router.post("/feedback", async (req, res) => {

    
    try {
        if(!req.body.employeeId) throw new Error("Employee Id is required")
        if(!req.body.rating) throw new Error("Rating is required")
        if(!req.body.name) throw new Error("Name is required")
        const employee = await Employee.findById(req.body.employeeId)
        if (!employee)
            throw new Error("Invalid Id");
        const {
            name,
            phone,
            message,
            employeeId,
            rating,
        } = req.body;
        

        if (rating < 0 || rating > 5)
            throw new Error("Invalid Request")

        const ratingData = Rating({
            name,
            phone,
            message,
            departmentId: employee.departmentId,
            employeeId,
            rating,
            createdOn: new Date()
        })
        await ratingData.save()

        let result = await Rating.aggregate([
            {$match: { employeeId: { $eq: new mongoose.Types.ObjectId(employeeId) }}},
            {$group: { _id: null, avg_value: {$avg: '$rating'}}}
        ]);
        if(result && result.length)
        {
            await Employee.findByIdAndUpdate( employeeId , {rating: result[0].avg_value.toFixed(1)})
        }
        result = await Rating.aggregate([
            {$match: {departmentId: { $eq: employee.departmentId }}},
            {$group: {_id: null, avg_value: {$avg: '$rating'}}}
        ]);
        if(result && result.length)
        {
            await Department.findByIdAndUpdate( employee.departmentId, {rating: result[0].avg_value.toFixed(1)})
        }


        res.json({ success: true })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }

})

//dashboard
router.get('/dashboard', async (req, res) => {
    try {
      const stats = {
        departments: 0,
        employees: 0,
        ratings: 0
      }
  
      if (req.user.type == userTypes.USER_TYPE_SUPER_ADMIN)
        stats.departments = await Department.estimatedDocumentCount()
  
      if (req.user.type == userTypes.USER_TYPE_SUPER_ADMIN) {
        stats.employees = await Employee.estimatedDocumentCount()
        stats.ratings = await Rating.estimatedDocumentCount()
      } else {
        stats.employees = await Employee.countDocuments({ departmentId: req.user.departmentId })
        stats.ratings = await Rating.countDocuments({ departmentId: req.user.departmentId })
      }
  
      res.json({ stats })
    } catch (error) {
      res.status(400).json({ error: error.message })
  
    }
  })
  
//Public Search
  router.post("/publicSearch", async (req, res) => {
    try {
      if (!req.body.departmentId)
        throw new Error("departmentId is required")
      if (!req.body.name)
        throw new Error("name is required")
  
      const department = await Department.findById(req.body.departmentId);
      if (!department) throw new Error("Department does not exists");
      // $regex stands for regular-expresions and options i stands for case sensitive
      const filter = { departmentId: req.body.departmentId, name: { $regex: req.body.name, $options: 'i' } }
  
      const employees = await Employee.find(filter, { _id: 1, profilePicture: 1, departmentId: 1 , name: 1, phone: 1, cnic: 1 })
  
      res.status(200).json({ employees });
  
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })

//Public Details Employee
router.get("/publicDetails/:employeeId", async (req, res) => {


    try {
        // if id is not available
        if (!req.params.employeeId)
            throw new Error("Employee Id is invalid")
        if (!mongoose.isValidObjectId(req.params.employeeId))
            throw new Error("Invalid Id");


        const employee = await Employee.findById(req.params.employeeId, {_id: 1, name: 1, departmentId: 1, profilePicture: 1})
        if (!employee)
            throw new Error("Invalid Id");

        res.json({employee})

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

module.exports = router;