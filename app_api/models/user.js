const passport = require("passport");
const mongoose = require("mongoose");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required:true,
    },
    hash:String,
    salt:String

});

// Method to set the password on this record.
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt,
    1000, 64, 'sha512').toString('hex');
    };

// Method to compare entered password against stored hash
userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password,
    this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
    };

// Method to generate a JSON Web Token for the current record
userSchema.methods.generateJWT = function() {
    return jwt.sign(
    { // Payload for our JSON Web Token
    _id: this._id,
    email: this.email,
    name: this.name,
    },
    process.env.JWT_SECRET, //SECRET stored in .env file
    { expiresIn: '1h' }); //Token expires an hour from creation
    };
    
    
    
const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }
  const user = new User();
  user.name = req.body.name;
  user.email = req.body.email;
  user.setPassword(req.body.password);
  const token = user.generateJwt();
  try {
    const q = await user.save();
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
const login = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.log(err);
      return res.status(404).json(err);
    }
    if (user) {
      const token = user.generateJwt();
      res.status(200).json({ token });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};

const User = mongoose.model('users', userSchema);

module.exports = User, register, login;
