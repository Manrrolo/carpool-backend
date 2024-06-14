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
  app.get("/api/requests/driver", [authJwt.verifyToken, authJwt.isDriver], requests.getAllRequestsForDriver);

  // Obtener todas las solicitudes para una publicación específica
  app.get("/api/requests/publication/:publicationId", [authJwt.verifyToken, authJwt.isDriver], requests.getRequestsForPublication);

  // Obtener todas las solicitudes para un passenger
  app.get("/api/requests/passenger", [authJwt.verifyToken], requests.getAllRequestsForPassenger);

  // Obtener una solicitud por ID
  app.get("/api/requests/:requestId", [authJwt.verifyToken], requests.getRequestById);

  // Crear una nueva solicitud para una publicación
  app.post("/api/requests", [authJwt.verifyToken], requests.createRequest);

  // Actualizar el estado de una solicitud (solo para el driver)
  app.put("/api/requests/status/:requestId", [authJwt.verifyToken, authJwt.isDriver], requests.updateRequestStatus);

  // // Actualizar una solicitud (solo para el passenger)
  // app.put("/api/requests/:requestId", [authJwt.verifyToken], requests.updateRequestByPassenger);
};
