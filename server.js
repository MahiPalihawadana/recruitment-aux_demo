const express = require("express");
const path = require("path");
const eh = require("errorhandler");
const cors = require("cors");
const mongoose = require("mongoose");
const es = require("express-session");
const bp = require("body-parser");
const passport = require('passport')

mongoose.Promise = global.Promise;

const mongodbAPI = "mongodb://127.0.0.1:27017/authdb";
const app = express();
app.use(passport.initialize())
app.use(cors());
app.use(require("morgan")("dev"));
app.use(bp.urlencoded({ extended: false }));
app.use(bp.json());
app.use('/usr',require('./routes/routes'))


//app.use(express.static(path.join(__dirname, "public")));
app.use(eh());
// app.use(
//   es({
//     secret: "authdemo",
//     cookie: { maxAge: 60000 },
//     resave: false,
//     saveUninitialized: false
//   })
// );

const user = require("./db/users");
//const passport = require("./config/passport");

mongoose.connect(mongodbAPI, err => {
  if (!err) console.log("connected to mongodb sucsessfully");
});
mongoose.set("debug", true);













app.listen(3000, () => {
  console.log("listning on 3000");
});
