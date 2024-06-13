const db = require('../models');
const Request = db.request;
const Publication = db.publication;
const User = db.user;

// Middleware to check if user is the driver of a publication
const isDriverOfPublication = (req, res, next) => {
  const driverId = req.userId;
  const publicationId = req.params.publicationId || req.body.publicationId;

  Publication.findByPk(publicationId)
    .then(publication => {
      if (!publication) {
        return res.status(404).send({ message: "Publication Not found." });
      }
      if (publication.driverId !== driverId) {
        return res.status(403).send({ message: "You are not the driver of this publication." });
      }
      next();
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// Middleware to check if user is the passenger of a request
const isPassengerOfRequest = (req, res, next) => {
  const passengerId = req.userId; 
  const requestId = req.params.requestId;

  Request.findByPk(requestId)
    .then(request => {
      if (!request) {
        return res.status(404).send({ message: "Request Not found." });
      }
      if (request.passengerId !== passengerId) {
        return res.status(403).send({ message: "You are not the passenger of this request." });
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

// GET all requests for a passenger
exports.getAllRequestsForPassenger = (req, res) => {
  const passengerId = req.userId;

  Request.findAll({
    where: { passengerId }
  })
    .then(requests => {
      res.status(200).send(requests);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// GET a request by ID
exports.getRequestById = (req, res) => {
  const requestId = req.params.requestId;

  Request.findByPk(requestId)
    .then(request => {
      if (!request) {
        return res.status(404).send({ message: "Request Not found." });
      }
      res.status(200).send(request);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// POST create a new request for a publication
exports.createRequest = (req, res) => {
  const { publicationId, reservationDate } = req.body;
  const passengerId = req.userId;

  Request.create({ publicationId, passengerId, reservationDate, status: 'pending' })
    .then(request => {
      res.status(201).send(request);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

// PUT update the status of a request by the driver
exports.updateRequestStatus = [isDriverOfPublication, (req, res) => {
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

// PUT update a request by the passenger
exports.updateRequestByPassenger = [isPassengerOfRequest, (req, res) => {
  const requestId = req.params.requestId;
  const { publicationId, reservationDate } = req.body;

  Request.update({ publicationId, reservationDate }, {
    where: { requestId }
  })
    .then(num => {
      if (num == 1) {
        res.status(200).send({ message: "Request was updated successfully." });
      } else {
        res.status(404).send({ message: `Cannot update Request with id=${requestId}. Maybe Request was not found or req.body is empty!` });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
}];
