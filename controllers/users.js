const express = require("express");
const mongoose = require("mongoose")
const User = require("../models/User")
const moment = require("moment/moment");
const { createJWTToken, userTypes } = require("../utils/utils");
const { verifyuser } = require("../middlewares/auth")
const ejs = require("ejs")
const multer = require("multer")
const fs = require('fs').promises;
const path = require("path")


const { randomBytes } = require('crypto');
const { default: axios } = require('axios');


const router = express.Router();
const bcrypt = require("bcrypt");

router.use(["/all", "/add", "/edit", "/delete", "/profile", "/profile-update"], verifyuser);

//Add new users
router.post("/add", async (req, res) => {
  const record = {
    name,
    email,
    phoneNumber,
    profilePicture,
    password,
    passwordResetCode,
    emailVerificationCode,
    type,
  } = req.body;
  try {

    const userExist = await User.findOne({ email: req.body.email })
    if (userExist)
      throw new Error("Email is already Registered")

    const record = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: await bcrypt.hash(req.body.password, 10),
      createdOn: new Date()
    }

    if (req.user.type === userTypes.USER_TYPE_STANDARD_ADMIN) {
      record.departmentId = req.user.departmentId;
      record.type = userTypes.USER_TYPE_STANDARD_ADMIN
    } else {

      record.type = req.bosy.type;
      if (req.body.type === userTypes.USER_TYPE_STANDARD_ADMIN) record.departmentId = req.body.departmentId
    }
    const user = new User(record)

    await user.save();
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

//Edit Users
router.post("/edit", async (req, res) => {

  try {

    // if id is not available
    if (!req.body.id)
      throw new Error("User Id is Requird")


    // check for valid object Id using mongoose this will check the id is this id is according to formula of #
    if (!mongoose.isValidObjectId(req.body.id))
      throw new Error("Invalid Id");


    // check for the valid id


    const user = await User.findById(req.body.id)
    if (!user)
      throw new Error("Invalid Id");
      
    if (req.user.type === userTypes.USER_TYPE_STANDARD_ADMIN && user.departmentId.toString() !== req.user.departmentId.toString())
      throw new Error("Invalid Id");
      


    const record = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      modifiedOn: new Date()
    }

    if (req.body.password)
      record.password = await bcrypt.hash(req.body.password, 10);
      
      
      const updatedUser = await User.findByIdAndUpdate(req.body.id, record)
    res.status(200).json({ user: updatedUser })

  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

//Sign-In Users
router.post("/signin", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!password)
      throw new Error("Password is required")

    if (!email)
      throw new Error("Email or Password incorrect")

    let user = await User.findOne({ email: email })

    if (!user)
      throw new Error("Email or Password incorrect")

    const hashedPassword = user.password;

    const isPasswordMatch = await bcrypt.compare(req.body.password, hashedPassword);

    if (!isPasswordMatch)
      throw new Error("Password Not match")

    user = user.toObject();
    delete user.password;
    user.createdOn = moment().format("YYYY-MM-DD")

    const token = await createJWTToken(user, 24 * 365 * 50)

    res.json({ user, token })


  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

//forgot_password
router.post("/forgot-password", async (req, res) => {

  try {
    if (!req.body.email) throw new Error("Email is required");
    let user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("Invalid request");

    const passwordResetCode = user._id.toString() + randomBytes(Math.ceil(25 / 2)).toString('hex').slice(0, 25);
    await User.findByIdAndUpdate(user._id, { passwordResetCode });
    const resetPasswordUrl = process.env.BASE_URL + "admin/reset-password/" + passwordResetCode;
    console.log(resetPasswordUrl)
    const data = {
      Recipients: {
        To: [user.email]
      },
      Content: {
        Body: [{
          ContentType: 'HTML',
          Content: await ejs.renderFile('./emails/resetPassword.ejs', { name: user.name, resetPasswordUrl }),
          Charset: "utf8"
        }],
        subject: "Reset Password",
        from: process.env.EMAIL_FROM
      }
    }

    const response = await axios.post('https://api.elasticemail.com/v4/emails/transactional', data, {
      headers: { 'X-ElasticEmail-ApiKey': process.env.EMAIL_API_KEY }
    })

    console.log(response)

    res.json({ success: true });

  } catch (error) {
    console.log(error)
    res.status(400).json({ error: error.message });
  }
});

router.post("/verify-reset-code", async (req, res) => {

  try {
    if (!req.body.code) throw new Error("Code is required");
    let user = await User.findOne({ passwordResetCode: req.body.code });
    if (!user) throw new Error("Invalid request");

    user = user.toObject();
    delete user.password;

    res.json({ user });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {

  try {
    if (!req.body.code) throw new Error("Code is required");
    if (!req.body.newPassword) throw new Error("New password is required");
    if (!req.body.confirmPassword) throw new Error("Confirm password is required");

    if (req.body.newPassword.length < 6)
      throw new Error("Password should have at least 6 characters");

    if (req.body.newPassword !== req.body.confirmPassword)
      throw new Error("Passwords are not same");

    let user = await User.findOne({ passwordResetCode: req.body.code });
    if (!user) throw new Error("Invalid request");

    await User.findByIdAndUpdate(user._id, {
      password: await bcrypt.hash(req.body.newPassword, 10),
      passwordResetCode: ''
    })

    res.json({ success: true });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//Delete Users
router.post('/delete', async (req, res) => {
  try {
    //  if id is not available
    if (!req.body.id)
      throw new Error("User Id is Requird")


    // check for valid object Id using mongoose this will check the id is this id is according to formula of #
    if (!mongoose.isValidObjectId(req.body.id))
      throw new Error("Invalid Id");


    // check for the valid id
    const user = await User.findById(req.body.id)
    if (!user)
      throw new Error("Invalid Id");
    
    if(req.body.id === req.user._id.toString())
      throw new Error("Invalid Id");
    
    if (req.user.type === userTypes.USER_TYPE_STANDARD_ADMIN && user.departmentId.toString() !== req.user.departmentId.toString())
      throw new Error("Invalid Id");
      

    await User.findByIdAndDelete(req.body.id)
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

//Profile Data
router.get("/profile", async (req, res) => {
  try {
    let user = await User.findById(req.user._id)
    user = user.toObject()
    delete user.password
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(`content/${req.user._id}/`, { recursive: true });
      cb(null, `content/${req.user._id}/`)
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

//Profile Update
router.post("/profile-update", upload.single("profilePicture"), async (req, res) => {
  try {
    const record = {
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      modifiedOn: new Date()
    }
    if (req.file && req.file.filename) {
      record.profilePicture = req.file.filename
      if (req.user.profilePicture && req.user.profilePicture !== req.file.filename) {
        const oldPicPath = `content/${req.user._id}/${req.user.profilePicture}`
        await fs.unlink(oldPicPath)
      }
    }

    if (!req.body.name) throw new Error("Name is required");
    if (req.body.newPassword) {
      if (!req.body.currentPassword) throw new Error("Current password is required");

      if (!(await bcrypt.compare(req.body.currentPassword, req.user.password)))
        throw new Error("Current password is incorrect");

      if (!req.body.newPassword.length < 6) throw new Error("New password should have atleast 6 characters");

      if (req.body.newPassword !== req.body.confirmPassword) throw new Error("Passwords are not same");

    }

    await User.findByIdAndUpdate(req.user._id, record)

    let updatedUser = await User.findById(req.user._id);

    updatedUser = updatedUser.toObject();
    delete updatedUser.password;
    res.json({ user: updatedUser });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {

    const conditions = {}
    if (req.user.type === userTypes.USER_TYPE_STANDARD_ADMIN) {
      conditions.departmentId = req.user.departmentId
      conditions.type = userTypes.USER_TYPE_STANDARD_ADMIN
    }

    let users = await User.find(conditions);

    res.status(200).json({ users });
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

module.exports = router;