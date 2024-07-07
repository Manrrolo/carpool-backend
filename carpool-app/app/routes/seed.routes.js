const { authJwt } = require('../middleware');
const controller = require('../controllers/seed.controller');

module.exports = function setupSeedRoutes(app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  // Endpoint para reiniciar las seeds
  app.post('/api/seed/reset', [authJwt.verifyToken], controller.seedDatabase);
};
