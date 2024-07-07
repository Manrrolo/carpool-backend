const { authJwt } = require('../middleware');
const controller = require('../controllers/trip.controller');

module.exports = function setupTripRoutes(app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });


  // obtener todos los trips de un driver
  app.get('/api/trips/driver', [authJwt.verifyToken, authJwt.isDriver], controller.getAllTripsForDriver);

  // obtener trips de una publication (driver)
  app.get('/api/trips/publication/:publicationId', [authJwt.verifyToken, authJwt.isDriver], controller.getTripsForPublication);

  // obtener info de trip (estado, pasajeros, driver)
  app.get('/api/trips/info/:tripId', [authJwt.verifyToken], controller.getInfoOfTrip);

  // obtener el trip de driver de una publicacion (solo el propio driver)
  app.get('/api/trips/driver/publication/:publicationId', [authJwt.verifyToken, authJwt.isDriver], controller.getDriverTripOfPublication);

  // obtener todos los trips de un passenger, drivers no veran trips de sus propios viajes
  app.get('/api/trips/passenger', [authJwt.verifyToken], controller.getAllTripsForPassenger);

  // obtener trip in progress de un user
  app.get('/api/trips/in-progress', [authJwt.verifyToken], controller.getInProgressTripForUser);

  // obtener trips completed de un user
  app.get('/api/trips/completed', [authJwt.verifyToken], controller.getCompletedTripsForUser);

  // obtener trip por ID
  app.get('/api/trips/:tripId', [authJwt.verifyToken], controller.getTripById);

  // crear trip (passengers y driver)
  //app.post('/api/trips', [authJwt.verifyToken], controller.createTrip);
  // ahora trips se crean automaticamente, el de driver al crear publicacion y los de pasajeros al aceptarse su solicitud

  // comenzar trip (driver y passenger,no se puede tener mas de uno in progress)
  app.put('/api/trips/start/:tripId', [authJwt.verifyToken], controller.startTrip);

  // terminar trip (driver y user, actualiza estado a 'completed' y actualiza arrivalDateTime)
  app.put('/api/trips/complete/:tripId', [authJwt.verifyToken], controller.completeTrip);

  // obtener perfil de un user por tripId y groupId
  app.get('/api/user/profile/:tripId/:groupId', [authJwt.verifyToken], controller.getUserProfileByGroupId);
};