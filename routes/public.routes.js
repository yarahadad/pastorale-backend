const { authJwt } = require("../middlewares");
const controller = require("../controllers/public.controller");

module.exports = function(app) {
//   app.get("/api/landing-data", controller.get);
  app.post("/api/verify-token", controller.verifyToken);
};