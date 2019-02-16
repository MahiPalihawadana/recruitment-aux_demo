const express = require("express");
const router = express.Router();
const passport = require("passport");
const user = require("../db/users");
require("../config/passport");

router.post("/reg", (req, res) => {
  console.log(req.body);

  const newuser = new user({
    email: req.body.email
  });
  console.log(`email - ${req.body.email}  pass - ${req.body.password}`);
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

router.get('/dashboard',(req,res,next)=>{
  passport.authenticate('jwtstrategy',{ session: false },(err,user,info)=>{
    console.log('error - '+err)
    console.log('user - '+user)
    console.log('info -- '+info)

    if(user){
      res.status(401).send(info)
    }else{
      res.send(user)
    }

  })(req,res,next)
})

router.get(
  "/pro",
  passport.authenticate("jwtstrategy", { session: false }),
  (req, res) => {
    //console.log(req);
    
    console.log(" req info "+req.authInfo)
    
    res.send(req.user);
    console.log("verified user");
   // res.send("works");
  }
);

// router.get(
//   "/protected",
//   passport.authenticate("jwtstrategy", { session: false }),
//   (req, res) => {
//     const { user } = req;

//     res.status(200).send({ user });
//   }
// );

module.exports = router;
