const db = require('../models');
const Request = db.request;
const Publication = db.publication;
const User = db.user;

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

// // PUT update a request by the passenger
// exports.updateRequestByPassenger = (req, res) => {
//   const requestId = req.params.requestId;
//   const { publicationId, reservationDate } = req.body;

//   Request.update({ publicationId, reservationDate }, {
//     where: { requestId }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.status(200).send({ message: "Request was updated successfully." });
//       } else {
//         res.status(404).send({ message: `Cannot update Request with id=${requestId}. Maybe Request was not found or req.body is empty!` });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({ message: err.message });
//     });
// };
