require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const userController = require("./controllers/users")


const app = express();
app.use(cors())
app.use(express.json())

app.use ("/api/users", userController)

mongoose.connect(process.env.MONGODB_CONNECTION_URI).then( () => {
    console.log("database is connected")
  }).catch(err => {
    console.log( `Error`, err )
  })




app.get("/test", (req, res) => {
    res.send("Server is working properly")
})

app.all("*", (req, res) => {
    res.send("Page Not found")
})

app.listen(5000, () => {
    console.log(`Listening at 5000`)
})