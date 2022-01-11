const { authJwt } = require("../middlewares");
const controller = require("../controllers/events.controller");

module.exports = function(app) {
  app.get("/api/events", authJwt.verifyToken, controller.get);
  app.put("/api/add-event", authJwt.verifyToken, controller.add);
  app.post("/api/update-event", authJwt.verifyToken, controller.update);
  app.post("/api/delete-event", authJwt.verifyToken, controller.delete);
};