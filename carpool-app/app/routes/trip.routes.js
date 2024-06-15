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

  // obtener trip de una publication (driver y passenger?)
  app.get('/api/trips/publication/:publicationId', [authJwt.verifyToken], controller.getTripForPublication);

  // obtener todos los trips de un passenger
  app.get('/api/trips/passenger', [authJwt.verifyToken], controller.getAllTripsForPassenger);

  // obtener trip por ID
  app.get('/api/trips/:tripId', [authJwt.verifyToken, authJwt.isDriver], controller.getTripById);

  // crear trip (solo drivers, inicia con estado 'in pending')
  app.post('/api/trips', [authJwt.verifyToken, authJwt.isDriver], controller.createTrip);

  // comenzar trip (solo driver al que pertenece, actualiza estado a 'in progress' y actualiza departureDateTime)
  app.put('/api/trips/start/:tripId', [authJwt.verifyToken, authJwt.isDriver], controller.startTrip);

  // terminar trip (solo driver al que pertenece, actualiza estado a 'completed' y actualiza arrivalDateTime)
  app.put('/api/trips/complete/:tripId', [authJwt.verifyToken, authJwt.isDriver], controller.completeTrip);
};