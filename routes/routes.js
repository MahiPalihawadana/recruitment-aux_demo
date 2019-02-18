const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../db/users");
const ObjectID = require("mongodb").ObjectID;
require("../config/passport");

router.post("/reg", (req, res) => {
  console.log(req.body);

  console.log(`************${req.headers.authorization}****************`)

  const newuser = new User({
    email: req.body.email
  });
  console.log(`email - ${req.body.email}  pass - ${req.body.password}`);
  newuser.setpass(req.body.password);
  newuser
    .save()
    .then(result => {
      //

      console.log("succsess");
      var token = result.generateJWT();
      return res.status(200).send(token);
    })
    .catch(err => {
      res.status(403).json(err);
    });
});

router.post("/login1", function(req, res, next) {
  passport.authenticate("local", function(err, user, info) {
    console.log("ppppp");
    if (err) {
      console.log("error no user");
      return next(err);
    }
    if (!user) {
      console.log("error no1");
      console.log(info.message);
      return res.send(user);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      } else {
        console.log("done");
        var token = user.generateJWT();
        // res.cookie("jwt", token, { httpOnly: true, secure: true });
        return res.status(200).send(token);
      }
    });
  })(req, res, next);
});

router.get("/dashboard", (req, res, next) => {
  passport.authenticate(
    "jwtstrategy",
    { session: false },
    (err, user, info) => {
      console.log("error - " + err);
      console.log("user - " + user);
      console.log("info -- " + info);

      if (!user) {
        res.status(401).send(info);
      } else {
        res.send(user);
      }
    }
  )(req, res, next);
});



router.get("/user/:id", (req, res, next) => {
  passport.authenticate(
    "jwtstrategy",
    { session: false },
    (err, user, info) => {

      console.log("error - " + err);
      console.log("user - " + user);
      console.log("info -- " + info);
      
      console.log("hiiii");
      var iid = req.params.id;
      console.log(iid);

      User.findById(ObjectID(iid))
        .then(result => {
          console.log("found" + result);
          res.json(result);
        })
        .catch(err => {
          console.log("err - " + err);
        });
    }
  )(req, res, next);
});




router.post('/fogotpassword',(req,res)=>{

  var email = req.body.email;

  User.find({email:email}).then(result=>{
    if(!result){
      console.log(result+"not found error")
    }
    else{
        console.log(result.id)
    }
  })



})

router.post('/resetpassword/:id',(req,res)=>{



})

// router.get(
//   "/protected",
//   passport.authenticate("jwtstrategy", { session: false }),
//   (req, res) => {
//     const { user } = req;

//     res.status(200).send({ user });
//   }
// );

module.exports = router;
