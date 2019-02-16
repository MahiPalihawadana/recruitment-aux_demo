const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: {
    type: String
  },
  hash: {
    type: String
  },
  salt: {
    type: String
  }
});

userSchema.methods.setpass = function(password) {
  console.log(this);
  this.salt = crypto.randomBytes(16).toString("hex");
  console.log(`salt = ${this.salt}`);
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

userSchema.methods.verifypass = function(password) {
  console.log('this name - '+this.email)
  console.log('salt - '+this.salt)
  console.log('pass - '+password)
  userr = this
  const hash = crypto
    .pbkdf2Sync(password, this.salt , 10000, 512, "sha512")
    .toString("hex");
  return hash === this.hash;
};

userSchema.methods.generateJWT = function(){
  console.log('inside genJWT')
  
 // console.log(this.email)

  return jwt.sign(
    {
      email: this.email,
      id: this._id,
    },
    "authdemo",{expiresIn:'10m'}
  );
};

// userSchema.methods.getAuthToken = () => {
//   return { _id: this._id, email: this.email, token: this.generateJWT() };
// };

const User = mongoose.model("User", userSchema);

module.exports = User;
