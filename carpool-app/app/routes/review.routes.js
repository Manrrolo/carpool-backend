const { authJwt } = require('../middleware');
const controller = require('../controllers/review.controller');

module.exports = function setupReviewRoutes(app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  // Obtener todas las revisiones de un usuario
  app.get('/api/reviews/user/:userId', [authJwt.verifyToken], controller.getAllReviewsByUser);

  // Obtener todas las revisiones de un viaje
  app.get('/api/reviews/trip/:tripId', [authJwt.verifyToken], controller.getAllReviewsByTrip);

  // Crear nueva revisión
  app.post('/api/reviews', [authJwt.verifyToken], controller.createReview);

  // Actualizar revisión
  app.patch('/api/reviews/:reviewId', [authJwt.verifyToken], controller.updateReview);

  // Eliminar revisión
  app.delete('/api/reviews/:reviewId', [authJwt.verifyToken], controller.deleteReview);
};