const passport = require("passport");
const localstratergy = require("passport-local").Strategy;
const users = require("../db/users");

//module.exports = function(passport){
passport.use(
  "local",
  new localstratergy({ usernameField: "email" }, function(
    email,
    password,
    done
  ) {
    console.log("inside passport");
    console.log(`email -${email} \npass -  ${password}\n`)

    users
      .findOne({ email: email })
      .then(data => {
        if (!data) {
          return done(null, false, { message: "no user found invalid email" });
        }
        if(data){
          console.log('user have '+data.email)
          console.log(password)
        }
        if (data.verifypass(password)) {
          console.log("wede hari");
          return done(null, data);
        }
        else{
          return done(null, false, { message: "invalid password" });
        }
      })
      .catch(err => done(err));

      passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
  })
);

// pp.use(
//   new localstratergy(
//     {
//       usernameField: "user[email]",
//       passwordField: "user[password]"
//     },
//     (email, pass, done) => {
//       users
//         .findOne({ email })
//         .then(user => {
//           if (!user || !user.verifypass(pass)) {
//             return done(null, false, {
//               errors: { "email or password": "is invalid" }
//             });
//           }
//           return done(null, user);
//         })
//         .catch(done);
//     }
//   )
// );
