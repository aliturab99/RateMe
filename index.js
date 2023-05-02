require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')
const userRoutes = require("./controllers/users")
const deparmentRoutes = require("./controllers/departments")


const app = express();
app.use(cors())
app.use(express.json())

app.use ("/api/users", userRoutes)
app.use ("/api/departments", deparmentRoutes)

mongoose.connect(process.env.MONGODB_CONNECTION_URI).then( () => {
    console.log("database is connected")
  }).catch(err => {
    console.log( `Error`, err )
  })

app.all("*", (req, res) => {
    res.send("Page Not found")
})

app.listen(5000, () => {
    console.log(`Listening at 5000`)
})