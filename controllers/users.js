const express = require("express");
const mongoose = require("mongoose")
const User = require("../models/User")
const moment = require("moment/moment");
const { createJWTToken } = require("../utils/utils");
const verifyuser = require("../middlewares/auth")
const ejs = require("ejs")

const { randomBytes } = require('crypto');
const { default: axios } = require('axios');


const router = express.Router();
const bcrypt = require("bcrypt");

router.use(["/add", "/edit", "/delete", "/profile", "/profile-update"], verifyuser);

//Add new users
router.post("/add", async (req, res) => {
    const {
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
        const user = User({
            name,
            email,
            phoneNumber,
            profilePicture,
            password: await bcrypt.hash(req.body.password, 10),
            passwordResetCode,
            emailVerificationCode,
            type,
        });
        await user.save();
        res.json({ user });
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

//Edit Users
router.post("/edit", async (req, res) => {

    try {

        const userExist = await User.findOne({ email: req.body.email })
        if (userExist)
            throw new Error("Email is already exists")
    

        // if id is not available
        if (!req.body.id)
            throw new Error("User Id is Requird")


        // check for valid object Id using mongoose this will check the id is this id is according to formula of #
        if (!mongoose.isValidObjectId(req.body.id))
            throw new Error("Invalid Id");

            
            // check for the valid id
            
            //check that person is editing it's own information
            if (req.user._id.toString() !== req.body.id)
            throw new Error("Invalid request");
            
            const user = await User.findById(req.body.id)
            if (!user)
            throw new Error("Invalid Id");


            const {
                name,
                email,
                phoneNumber,
                profilePicture,
                password,
                type,
            } = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.body.id, {
            name,
            email,
            phoneNumber,
            profilePicture,
            password,
            type,

        });
        res.json({ user: updatedUser })

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

        const token = await createJWTToken(user, 24*365*50)

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
  
      const passwordResetCode = user._id.toString() + randomBytes(Math.ceil(25/2)).toString('hex').slice(0, 25);
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
            Content: await ejs.renderFile('./emails/resetPassword.ejs', { name: user.name, resetPasswordUrl } ),
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
  
      if(req.body.newPassword.length < 6)
        throw new Error("Password should have at least 6 characters");
  
      if(req.body.newPassword !== req.body.confirmPassword)
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
router.delete('/delete', async (req, res) => {
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
  
      await User.findByIdAndDelete(req.body.id)
      res.json({ success: true })
    } catch (err) {
      res.status(400).json({ error: err.message })
    }
  })

//Profile Data
router.get("/profile", async(req, res) =>{
    try{
      let user = await User.findById(req.user._id)
      user = user.toObject()
      delete user.password
      res.json({user});
    }catch(err){
      res.status(400).json({ error: err.message })
    }
  }) 

  //Profile Update
  router.post("/profile-update", async (req, res) => {

    try {

        const userExist = await User.findOne({ email: req.body.email, _id: { $ne: req.user._id } })
        if (userExist)
            throw new Error("Email is already exists")



            const {
                name,
                email,
                phoneNumber,
                profilePicture,
                password,
                type,
            } = req.body;

        let updatedUser = await User.findByIdAndUpdate(req.user._id, {
            name,
            email,
            phoneNumber,
            profilePicture,
            password,
            type,
        });
        updatedUser = updatedUser.toObject();
        delete updatedUser.password
        res.json({ user: updatedUser })

    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

router.get("/", async(req, res) =>{
    try{
      let users = await User.find();
      
      res.status(200).json(users);
    }catch(err){
      res.status(400).json({ error: err.message })
    }
  })

module.exports = router;