const path = require("path")
const express = require("express")
require("dotenv").config()
const cors = require("cors")
const { dbConnection } = require("./DB/config")
//console.log(process.env);

//create express server
const app = express()

//import db connection
dbConnection();

// CORS
app.use(cors())

//public directory
app.use(express.static("public"))

// parse json
app.use(express.json())

//create a route
//TODO: auth // create,login, renewToken
app.use("/api/auth", require("./routes/auth"))
app.use("/api/events", require("./routes/events"))

app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"))
})

//TODO: CRUD: Events


//listen on port 4000
app.listen(process.env.PORT, () => {
  console.log(`listen on port ${process.env.PORT}`);
})
