const db = require('../models');
const Request = db.request;
const Publication = db.publication;
const User = db.user;

// Middleware to check if user is the driver
const isDriver = (req, res, next) => {
  const driverId = req.userId; // assuming userId is set by JWT middleware
  const publicationId = req.params.publicationId;

  Publication.findByPk(publicationId)
    .then(publication => {
      if (publication.driverId !== driverId) {
        return res.status(403).send({ message: "You are not the driver of this publication." });
      }
      next();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// GET all requests for a driver
exports.getAllRequestsForDriver = (req, res) => {
  const driverId = req.userId;

  Publication.findAll({
    where: { driverId },
    include: [
      {
        model: Request,
        as: 'requests'
      }
    ]
  })
    .then(publications => {
      const requests = publications.flatMap(publication => publication.requests);
      res.status(200).send(requests);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// GET all requests for a publication
exports.getRequestsForPublication = (req, res) => {
  const publicationId = req.params.publicationId;

  Request.findAll({
    where: { publicationId }
  })
    .then(requests => {
      res.status(200).send(requests);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// POST create a new request for a publication
exports.createRequest = (req, res) => {
  const { publicationId, reservationDate } = req.body;
  const passengerId = req.userId; // assuming userId is set by JWT middleware

  Request.create({ publicationId, passengerId, reservationDate, status: 'pending' })
    .then(request => {
      res.status(201).send(request);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// PUT update the status of a request by the driver
exports.updateRequestStatus = [isDriver, (req, res) => {
  const requestId = req.params.requestId;
  const { status } = req.body;

  Request.update({ status }, {
    where: { requestId }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({ message: "Request status was updated successfully." });
      } else {
        res.status(404).send({ message: `Cannot update Request with id=${requestId}. Maybe Request was not found or req.body is empty!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}];
