const passport = require("passport");
const mongoose = require("mongoose");
const crypto = require('crypto');
const jwt = require ('jsonwebtoken');
const User = require('../models/user');
const register = async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields required" });
  }
  
    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.setPassword(req.body.password);
    const token = user.generateJWT();

 
  try {
    const q = await user.save();
    res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
}
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
      const token = user.generateJWT();
      res.status(200).json({ token });
    } else {
      res.status(401).json(info);
    }
  })(req, res);
};
module.exports = {
  register,
  login
};