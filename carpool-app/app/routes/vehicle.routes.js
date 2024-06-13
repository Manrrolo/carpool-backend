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


  app.get('/api/vehicles', controller.getVehicles);

  app.post('/api/vehicles', controller.createVehicle);

  app.patch('/api/vehicles/:id', controller.updateVehicle);

  app.delete('/api/vehicles/:id', controller.deleteVehicle);

  app.get('/api/vehicles/:id', controller.getVehicleById);

  app.get('/api/users/:userId/vehicles', controller.getVehicleByUserId);
};