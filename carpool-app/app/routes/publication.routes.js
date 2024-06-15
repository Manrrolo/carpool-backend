const { authJwt } = require('../middleware');
const controller = require('../controllers/publication.controller');

/**
 * @swagger
 * tags:
 *   name: Publications
 *   description: Publication management
 */

/**
 * @swagger
 * /api/publications:
 *   get:
 *     summary: Get all publications
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all publications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized.
 */

/**
 * @swagger
 * /api/createPublication:
 *   post:
 *     summary: Create a new publication (drivers only)
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               availableSeats:
 *                 type: integer
 *               cost:
 *                 type: number
 *     responses:
 *       201:
 *         description: Publication created successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Require Driver Role.
 */

/**
 * @swagger
 * /api/updatePublication/{id}:
 *   patch:
 *     summary: Update a publication (drivers only)
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Publication ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               origin:
 *                 type: string
 *               destination:
 *                 type: string
 *               availableSeats:
 *                 type: integer
 *               cost:
 *                 type: number
 *               status:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Publication updated successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Require Driver Role.
 */

/**
 * @swagger
 * /api/publications/{id}:
 *   get:
 *     summary: Get publication by ID
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Publication ID
 *     responses:
 *       200:
 *         description: Publication details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized.
 *       404:
 *         description: Publication not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Publication not found.
 */

/**
 * @swagger
 * /api/users/{driverId}/publications:
 *   get:
 *     summary: Get publications by user ID
 *     tags: [Publications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: driverId
 *         schema:
 *           type: string
 *         required: true
 *         description: Driver ID
 *     responses:
 *       200:
 *         description: List of publications for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized.
 */

module.exports = function setupPublicationRoutes(app) {
  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  // GET todas las publicaciones
  app.get(
    '/api/publications',
    [authJwt.verifyToken],
    controller.getAllPublications,
  );

  // POST nueva publicacion (solo para drivers)
  app.post(
    '/api/createPublication',
    [authJwt.verifyToken, authJwt.isDriver],
    controller.createPublication,
  );

  // PATCH actualizar publicacion (solo para drivers)
  app.patch(
    '/api/updatePublication/:id',
    [authJwt.verifyToken, authJwt.isDriver],
    controller.updatePublication,
  );

  // DELETE eliminar publicacion (solo para drivers)
  app.delete(
    '/api/deletePublication/:id',
    [authJwt.verifyToken, authJwt.isDriver],
    controller.deletePublication,
  );

  // GET publicación por ID
  app.get(
    '/api/publications/:id',
    [authJwt.verifyToken],
    controller.getPublicationById,
  );

  // GET publicaciones de un usuario
  app.get(
    '/api/users/:driverId/publications',
    [authJwt.verifyToken],
    controller.getPublicationsByUserId,
  );
};
