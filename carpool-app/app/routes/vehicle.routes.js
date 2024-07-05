const { authJwt } = require('../middleware');
const controller = require('../controllers/vehicle.controller');

module.exports = function setupVehiclesRoutes(app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });


  // obtener todos los vehiculos de un driver
  app.get('/api/vehicles/driver', [authJwt.verifyToken, authJwt.isDriver], controller.getAllVehiclesForDriver);

  // crear vehiculo (solo drivers)
  app.post('/api/vehicles', [authJwt.verifyToken, authJwt.isDriver], controller.createVehicle);

  // actualizar vehiculo (solo driver al que pertenece)
  app.patch('/api/vehicles/:vehicleId', [authJwt.verifyToken, authJwt.isDriver], controller.updateVehicle);

  // eliminar vehiculo (solo driver al que pertenece)
  app.delete('/api/vehicles/:vehicleId', [authJwt.verifyToken, authJwt.isDriver],controller.deleteVehicle);

  app.get('/api/vehicles/:id', [authJwt.verifyToken], controller.getVehicleById);
};