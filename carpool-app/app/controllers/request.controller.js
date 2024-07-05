// app/controllers/request.controller.js
const db = require('../models');
const Request = db.request;
const Publication = db.publication;
const User = db.user;
const Trip = db.trip;

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
// exports.getRequestsForPublication = async (req, res) => {
//   try {
//     const publicationId = req.params.publicationId;

//     const requests = await Request.findAll({
//       where: { publicationId }
//     });

//     res.status(200).send(requests);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

exports.getRequestsForPublication = async (req, res) => {
  try {
    const publicationId = req.params.publicationId;

    const publication = await Publication.findByPk(publicationId, {
      include: [
        {
          model: Request,
          as: 'requests',
          include: [
            {
              model: User,
              as: 'passenger',
              attributes: ['userId', 'firstName', 'lastName', 'email', 'phone']
            }
          ]
        }
      ]
    });

    if (!publication) {
      return res.status(404).send({ message: "Publication not found." });
    }

    res.status(200).send({
      requests: publication.requests,
      availableSeats: publication.availableSeats
    });
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
// exports.createRequest = async (req, res) => {
//   try {
//     const { publicationId, reservationDate } = req.body;
//     const passengerId = req.userId;

//     const request = await Request.create({ publicationId, passengerId, reservationDate, status: 'pending' });

//     res.status(201).send(request);
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

exports.createRequest = async (req, res) => {
  try {
    const { publicationId, reservationDate } = req.body;
    const passengerId = req.userId;

    const publication = await Publication.findByPk(publicationId);

    if (!publication) {
      return res.status(404).send({ message: "Publication not found." });
    }

    if (publication.availableSeats <= 0) {
      return res.status(400).send({ message: "No available seats." });
    }

    const existingRequest = await Request.findOne({
      where: {
        publicationId,
        passengerId
      }
    });

    if (existingRequest) {
      return res.status(400).send({ message: "You have already requested this publication." });
    }

    const request = await Request.create({ publicationId, passengerId, reservationDate, status: 'pending' });

    res.status(201).send(request);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// PUT update the status of a request by the driver
// exports.updateRequestStatus = async (req, res) => {
//   try {
//     const requestId = req.params.requestId;
//     const { status } = req.body;
//     const userId = req.userId;

//     // Find the request to get the associated publication
//     const request = await Request.findByPk(requestId, {
//       include: [{
//         model: Publication,
//         as: 'publication',
//       }],
//     });

//     if (!request) {
//       return res.status(404).send({ message: `Cannot find Request with id=${requestId}.` });
//     }

//     // Check if the publication's driverId matches the current user's ID
//     if (request.publication.driverId !== userId) {
//       return res.status(403).send({ message: 'You are not authorized to update the status of this request.' });
//     }

//     // Update the status of the request
//     const updatedRequest = await Request.update({ status }, {
//       where: { requestId },
//     });

//     if (updatedRequest == 1) {
//       if (status == "accepted"){
//         const trip = await Trip.create({ publicationId: request.publication.publicationId, userId: request.passengerId, status: 'pending' })
//       }

//       res.status(200).send({ message: "Request status was updated successfully." });
//     } else {
//       res.status(404).send({ message: `Cannot update Request with id=${requestId}.` });
//     }
//   } catch (err) {
//     res.status(500).send({ message: err.message });
//   }
// };

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

    // Check if there are available seats
    if (status === 'accepted' && request.publication.availableSeats <= 0) {
      return res.status(400).send({ message: "No available seats to accept the request." });
    }

    // Update the status of the request
    const updatedRequest = await Request.update({ status }, {
      where: { requestId },
    });

    if (updatedRequest == 1) {
      if (status === 'accepted') {
        const trip = await Trip.create({ publicationId: request.publication.publicationId, userId: request.passengerId, status: 'pending' });
        await Publication.update({ availableSeats: request.publication.availableSeats - 1 }, { where: { publicationId: request.publication.publicationId } });
      }

      res.status(200).send({ message: "Request status was updated successfully." });
    } else {
      res.status(404).send({ message: `Cannot update Request with id=${requestId}.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const userId = req.userId;

    // Encuentra la solicitud por ID e incluye la publicación relacionada
    const request = await Request.findByPk(requestId, {
      include: [{
        model: Publication,
        as: 'publication',
      }],
    });

    // Verifica si la solicitud existe
    if (!request) {
      return res.status(404).send({ message: `Cannot find Request with id=${requestId}.` });
    }

    // Verifica si el usuario está autorizado
    if (request.publication.driverId !== userId) {
      return res.status(403).send({ message: 'You are not authorized to update the status of this request.' });
    }

    // Actualiza el estado de la solicitud a 'rejected'
    const updatedRequest = await Request.update({ status: 'rejected' }, {
      where: { requestId },
    });

    if (updatedRequest == 1) {
      res.status(200).send({ message: "Request rejected successfully." });
    } else {
      res.status(404).send({ message: `Cannot update Request with id=${requestId}.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const userId = req.userId;

    // Encuentra la solicitud por ID e incluye la publicación relacionada
    const request = await Request.findByPk(requestId, {
      include: [{
        model: Publication,
        as: 'publication',
      }],
    });

    // Verifica si la solicitud existe
    if (!request) {
      return res.status(404).send({ message: `Cannot find Request with id=${requestId}.` });
    }

    // Verifica si el usuario está autorizado
    if (request.publication.driverId !== userId) {
      return res.status(403).send({ message: 'You are not authorized to update the status of this request.' });
    }

    // Verifica la disponibilidad de asientos
    if (request.publication.availableSeats <= 0) {
      return res.status(400).send({ message: "No available seats to accept the request." });
    }

    // Actualiza el estado de la solicitud a 'accepted'
    const updatedRequest = await Request.update({ status: 'accepted' }, {
      where: { requestId },
    });

    if (updatedRequest == 1) {
      // Crea un nuevo viaje y disminuye los asientos disponibles si hay al menos un asiento
      if (request.publication.availableSeats > 0) {
        await Trip.create({ publicationId: request.publication.publicationId, userId: request.passengerId, status: 'pending' });
        // await Publication.update({ availableSeats: request.publication.availableSeats - 1 }, { where: { publicationId: request.publication.publicationId } });

        const newAvailableSeats = request.publication.availableSeats - 1;
        const updatedPublication = { availableSeats: newAvailableSeats };
        
        if (newAvailableSeats === 0) {
          updatedPublication.status = false;
        }

        await Publication.update(updatedPublication, { where: { id: request.publication.publicationId } });
      }

      res.status(200).send({ message: "Request accepted successfully." });
    } else {
      res.status(404).send({ message: `Cannot update Request with id=${requestId}.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getPendingRequestsForPublication = async (req, res) => {
  try {
    const publicationId = req.params.publicationId;

    const requests = await Request.findAll({
      where: {
        publicationId,
        status: 'pending'
      }
    });

    const count = requests.length;

    res.status(200).send({
      requests,
      count
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};