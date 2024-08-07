const { authJwt } = require('../middleware');
const controller = require('../controllers/user.controller');
const multer = require('multer');
const upload = multer();


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

  app.put('/api/users/verifyUser', [authJwt.verifyToken], controller.changeRole);

  app.post('/api/users/:userId/uploadDriversLicence', [upload.single('driversLicence')], controller.uploadDriversLicence);

  app.get('/api/users/:userId/getDriversLicenceRequests', [authJwt.verifyToken], controller.getDriversLicenceRequests);

  app.get('/api/users/:userId/getDriversLicence', [authJwt.verifyToken], controller.getDriversLicence);

  app.del('/api/users/:userId/rejectLicence', [authJwt.verifyToken], controller.rejectDriversLicence);

  app.post('/api/users/:userId/acceptLicence', [authJwt.verifyToken], controller.acceptDriversLicence);

};
