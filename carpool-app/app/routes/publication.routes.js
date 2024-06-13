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
  app.get('/api/publications', controller.getAllPublications);

  // POST nueva publicacion
  app.post('/api/createPublication', controller.createPublication);

  // UPDATE publicacion
  app.patch('/api/updatePublication/:id', controller.updatePublication);

  // DEL publicacion
  app.delete('/api/deletePublication/:id', controller.deletePublication);

  // GET publicación por ID
  app.get('/api/publications/:id', controller.getPublicationById);

  // GET publicaciones de un usuario
  app.get('/api/users/:driverId/publications', controller.getPublicationsByUserId);
};