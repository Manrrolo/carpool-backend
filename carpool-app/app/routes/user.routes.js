const { authJwt } = require('../middleware');
const controller = require('../controllers/user.controller');

module.exports = function setupUserRoutes(app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  // app.get('/api/test/all', controller.allAccess);

  // app.get('/api/test/user', [authJwt.verifyToken], controller.userBoard);

  // app.get(
  //   '/api/test/mod',
  //   [authJwt.verifyToken],
  //   controller.moderatorBoard,
  // );

  // app.get(
  //   '/api/test/admin',
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.adminBoard,
  // );

  app.get('/api/users/:userId', [authJwt.verifyToken], controller.getProfile);

  // Ruta para actualizar el perfil del usuario
  app.put('/profile/:userId', [authJwt.verifyToken], controller.updateProfile);
};
