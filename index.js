const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dbConfig = require("./config/db.config");
var bcrypt = require("bcryptjs");
const options = require("./config/cors.config");
const Role = require("./models/role.model");
try {
  var corsOptions = options;
  
app.use(
	cors({
		origin: function (origin, callback) {
			return callback(null, true);
		},
		optionsSuccessStatus: 200,
		credentials: true,
		exposedHeaders: ["set-cookie"],
	})
);

  
//   parse requests of content-type - application/json
  app.use(bodyParser.json());
  
  // parse requests of content-type - application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({ extended: true }));
  app.get('/', (req,res) =>{
    res.status(200).send("This is the home route!")
  })
  require("./routes/auth.routes")(app);
  require("./routes/events.routes")(app);
  require("./routes/public.routes")(app);
  
  // set port, listen for requests
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Hello, Server is running on port ${PORT}`);
  });
  
  const db = require("./models");
  const User = db.user;
  
  db.mongoose
    .connect(dbConfig.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connect to MongoDB.");
      initial();
    })
    .catch((err) => {
      console.error("Connection error", err);
      process.exit();
    });
  
  function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "user",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'user' to roles collection");
        });
  
        new Role({
          name: "admin",
        }).save((err) => {
          if (err) {
            console.log("error", err);
          }
  
          console.log("added 'admin' to roles collection");
        });
      }
    });
  
    var datetime = new Date();
    let date = datetime.toISOString().slice(0, 10);
  
    User.findOne({
      username: "admin",
    }).exec((err, user) => {
      if (!err && !user) {
        new User({
          username: "admin",
          email: "admin@admin.com",
          password: bcrypt.hashSync("admin", 8),
          createdAt: date,
        }).save((err, user) => {
          Role.findOne({ name: "admin" }, (err, role) => {
            if (err) {
              console.log(err);
              return;
            }
  
            user.roles = [role._id];
            user.save((err) => {
              if (err) {
                res.status(500).send({ message: err });
                return;
              }
              console.log("Admin user was registered successfully!");
            });
          });
        });
      }
    });
  }  
} catch(error) {
 console.log('hello', error); 
}