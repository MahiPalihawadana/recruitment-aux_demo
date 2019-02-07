const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("../db/users");
const jwt = require('jsonwebtoken')
require("../config/passport");



router.post("/reg", (req, res) => {
  console.log(req.body);

  const newuser = new user({
    email: req.body.email,
    
  });
  console.log(`email - ${req.body.email}  pass - ${req.body.password}`)
  newuser.setpass(req.body.password);
  newuser
    .save()
    .then(result => {
        //
      console.log("succsess");
      res.redirect("/login1");
    })
    .catch(err => {
      res.status(403).json(err);
    });
});

router.post("/login", function(req, res, next) {
  console.log("awoooo");

  passport.authenticate("local", function(err, user, info) {
    if (err) {
      console.log("error");
    }
    if (info != undefined) {
      console.log(info);
      res.send(info.message);
    } else {
      console.log("jey");
      res.send(user);
    }
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
        console.log(info.message)
      return res.send(user)
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      else{
        console.log("done");
        var token= user.generateJWT()
        //console.log(jwt)
        //var sin = jwt.verify(token,'authdemo')
        //console.log('sin '+sin.email)
        return res.json(token)
      }
      
    });
  })(req, res, next);
});


router.get('/dashboard',(req,res)=>{
    res.send('dashboard')
})

module.exports = router;
