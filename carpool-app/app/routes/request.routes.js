const { authJwt } = require("../middleware");
const requests = require("../controllers/request.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  // Obtener todas las solicitudes para un driver
  app.get("/api/requests/driver", [authJwt.verifyToken], requests.getAllRequestsForDriver);

  // Obtener todas las solicitudes para una publicación específica
  app.get("/api/requests/publication/:publicationId", [authJwt.verifyToken], requests.getRequestsForPublication);

  // Crear una nueva solicitud para una publicación
  app.post("/api/requests", [authJwt.verifyToken], requests.createRequest);

  // Actualizar el estado de una solicitud (solo para el driver)
  app.put("/api/requests/:requestId", [authJwt.verifyToken], requests.updateRequestStatus);
};
