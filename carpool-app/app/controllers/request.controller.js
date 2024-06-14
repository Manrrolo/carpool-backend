// app/controllers/request.controller.js
const db = require('../models');
const Request = db.request;
const Publication = db.publication;
const User = db.user;

// GET all requests for a driver
exports.getAllRequestsForDriver = async (req, res) => {
  try {
    const driverId = req.userId; 

    const publications = await Publication.findAll({
      where: { driverId },
      include: [
        {
          model: Request,
          as: 'requests'
        }
      ]
    });

    const requests = publications.flatMap(publication => publication.requests);
    res.status(200).send(requests);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// GET all requests for a publication
exports.getRequestsForPublication = async (req, res) => {
  try {
    const publicationId = req.params.publicationId;

    const requests = await Request.findAll({
      where: { publicationId }
    });

    res.status(200).send(requests);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// GET all requests for a passenger
exports.getAllRequestsForPassenger = async (req, res) => {
  try {
    const passengerId = req.userId;

    const requests = await Request.findAll({
      where: { passengerId }
    });

    res.status(200).send(requests);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// GET a request by ID
exports.getRequestById = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    const request = await Request.findByPk(requestId);

    if (!request) {
      return res.status(404).send({ message: "Request Not found." });
    }

    res.status(200).send(request);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// POST create a new request for a publication
exports.createRequest = async (req, res) => {
  try {
    const { publicationId, reservationDate } = req.body;
    const passengerId = req.userId;

    const request = await Request.create({ publicationId, passengerId, reservationDate, status: 'pending' });

    res.status(201).send(request);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// PUT update the status of a request by the driver
exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;
    const userId = req.userId;

    // Find the request to get the associated publication
    const request = await Request.findByPk(requestId, {
      include: [{
        model: Publication,
        as: 'publication',
      }],
    });

    if (!request) {
      return res.status(404).send({ message: `Cannot find Request with id=${requestId}.` });
    }

    // Check if the publication's driverId matches the current user's ID
    if (request.publication.driverId !== userId) {
      return res.status(403).send({ message: 'You are not authorized to update the status of this request.' });
    }

    // Update the status of the request
    const updatedRequest = await Request.update({ status }, {
      where: { requestId },
    });

    if (updatedRequest == 1) {
      res.status(200).send({ message: "Request status was updated successfully." });
    } else {
      res.status(404).send({ message: `Cannot update Request with id=${requestId}.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
