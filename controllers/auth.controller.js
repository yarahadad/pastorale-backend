const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.register = (req, res) => {
  if(typeof req.body.username == "undefined") {
    return res.status(422).send({
      username: "Username is required"
    })
  }
  if(typeof req.body.email == "undefined") {
    return res.status(422).send({
      email: "email is required"
    })
  }
  if(typeof req.body.password == "undefined") {
    return res.status(422).send({
      password: "password is required"
    })
  }

  var datetime = new Date();
  let date = datetime.toISOString().slice(0, 10);
  
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    createdAt: date
  });

  user.save((err, user) => {
    if (err) {
      return res.status(500).send({ message: err });
      
    }
    return res.status(201).json({message:"User created successfully!", user: user})
  });
};

exports.login = (req, res) => {
  if(typeof req.body.username == "undefined") {
    return res.status(422).send({
      "username": "Username is required"
    })
  }

  if(typeof req.body.password == "undefined") {
    return res.status(422).send({
      "password": "Password is required"
    })
  }

  User.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
      if (err) {
       return  res.status(500).send({ message: err });
       
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      return res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        accessToken: token
      });
    });
};