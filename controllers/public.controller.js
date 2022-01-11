const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res) => {
    let token = req.body.token;
  
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }
  
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Token!" });
      }
      User.findById({
        _id: decoded.id,
      }).exec((err, user) => {
        user.password = null;
        return res.send(user);
      });
    });
  };