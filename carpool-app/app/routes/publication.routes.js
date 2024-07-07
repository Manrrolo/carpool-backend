const { authJwt } = require('../middleware');
const controller = require('../controllers/publication.controller');

module.exports = function setupPublicationRoutes(app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  // GET todas las publicaciones
  app.get('/api/publications', [authJwt.verifyToken], controller.getAllPublications);

  // POST nueva publicacion (solo para drivers)
  app.post('/api/createPublication', [authJwt.verifyToken, authJwt.isDriver], controller.createPublication);

  // POST publicaciones filtradas
  app.post('/api/publications/filtered', [authJwt.verifyToken], controller.postFilteredPublications);

  // PATCH actualizar publicacion (solo para drivers)
  app.patch('/api/updatePublication/:id', [authJwt.verifyToken, authJwt.isDriver], controller.updatePublication);

  // // DELETE eliminar publicacion (solo para drivers)
  // app.delete('/api/deletePublication/:id', [authJwt.verifyToken, authJwt.isDriver], controller.deletePublication);

  // GET publicación por ID
  app.get('/api/publications/:id', [authJwt.verifyToken], controller.getPublicationById);

  // GET publicaciones de un usuario
  app.get('/api/users/:driverId/publications', [authJwt.verifyToken], controller.getPublicationsByUserId);

  // PATCH cancelar publicación (solo para drivers)
  app.patch('/api/cancelPublication/:id', [authJwt.verifyToken, authJwt.isDriver], controller.cancelPublication);
};
