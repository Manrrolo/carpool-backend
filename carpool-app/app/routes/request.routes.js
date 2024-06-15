const { authJwt } = require('../middleware');
const requests = require('../controllers/request.controller');

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Request management
 */

/**
 * @swagger
 * /api/requests/driver:
 *   get:
 *     summary: Get all requests for a driver
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests for the driver
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
 * /api/requests/publication/{publicationId}:
 *   get:
 *     summary: Get all requests for a specific publication
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: publicationId
 *         schema:
 *           type: string
 *         required: true
 *         description: Publication ID
 *     responses:
 *       200:
 *         description: List of requests for the publication
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
 * /api/requests/passenger:
 *   get:
 *     summary: Get all requests for a passenger
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests for the passenger
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
 * /api/requests/{requestId}:
 *   get:
 *     summary: Get a request by ID
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request details
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
 *         description: Request not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Request not found.
 */

/**
 * @swagger
 * /api/requests:
 *   post:
 *     summary: Create a new request for a publication
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               publicationId:
 *                 type: string
 *               reservationDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Request created successfully
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
 * /api/requests/status/{requestId}:
 *   put:
 *     summary: Update the status of a request (driver only)
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request status updated successfully
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

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept',
    );
    next();
  });

  // Obtener todas las solicitudes para un driver
  app.get(
    '/api/requests/driver',
    [authJwt.verifyToken, authJwt.isDriver],
    requests.getAllRequestsForDriver,
  );

  // Obtener todas las solicitudes para una publicación específica
  app.get(
    '/api/requests/publication/:publicationId',
    [authJwt.verifyToken, authJwt.isDriver],
    requests.getRequestsForPublication,
  );

  // Obtener todas las solicitudes para un passenger
  app.get(
    '/api/requests/passenger',
    [authJwt.verifyToken],
    requests.getAllRequestsForPassenger,
  );

  // Obtener una solicitud por ID
  app.get(
    '/api/requests/:requestId',
    [authJwt.verifyToken],
    requests.getRequestById,
  );

  // Crear una nueva solicitud para una publicación
  app.post('/api/requests', [authJwt.verifyToken], requests.createRequest);

  // Actualizar el estado de una solicitud (solo para el driver)
  app.put(
    '/api/requests/status/:requestId',
    [authJwt.verifyToken, authJwt.isDriver],
    requests.updateRequestStatus,
  );

  // // Actualizar una solicitud (solo para el passenger)
  // app.put("/api/requests/:requestId", [authJwt.verifyToken], requests.updateRequestByPassenger);
};
