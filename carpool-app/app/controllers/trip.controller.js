const db = require('../models');
const Trip = db.trip;
const Publication = db.publication;
const Request = db.request;
const { DataTypes } = require('sequelize');

// GET all trips for a driver
exports.getAllTripsForDriver = async (req, res) => {
    const driverId = req.userId;

    Trip.findAll({
      where: { driverId: driverId },
    })
        .then(trips => {
            res.status(200).send(trips);
        })
        .catch(err => {
            res.status(500).send(err.message);
        })
};

// GET trip for a publication
exports.getTripForPublication = async (req, res) => {
    const publicationId = req.params.publicationId;

    Trip.findAll({
      where: { publicationId: publicationId },
    })
        .then(trips => {
            res.status(200).send(trips);
        })
        .catch(err => {
            res.status(500).send(err.message);
        })
};

// GET all trips for a passenger
exports.getAllTripsForPassenger = async (req, res) => {
  try {
    const passengerId = req.userId;

    const requests = await Request.findAll({
        where: {
            passengerId: passengerId,
            status: 'accepted',
        },
        include: [
            {
                model: Publication,
                as: 'publication',
                include: [{
                    model: Trip,
                    as: 'trip',
                }]
            }
        ]
    });

    const trips = requests.flatMap(requests => requests.publication.trip);
    res.status(200).send(trips);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// GET a trip by ID
exports.getTripById = async (req, res) => {
  try {
    const tripId = req.params.tripId;

    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).send({ message: "Request Not found." });
    }

    res.status(200).send(trip);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// POST create trip for publication
exports.createTrip = async (req, res) => {
  try {
    const { publicationId } = req.body;
    const driverId = req.userId;

    const trip = await Trip.create({ publicationId: publicationId, driverId: driverId, status: 'pending'});

    res.status(201).send(trip);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// PUT update the status of a trip to 'in progress', and update departureTime. 
exports.startTrip = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const status = 'in progress';
    const driverId = req.userId;
    const current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).send({ message: `Cannot find Trip with id=${tripId}.` });
    }

    // Check driverId
    if (trip.driverId !== driverId) {
      return res.status(403).send({ message: 'You are not authorized to update the status of this trip.' });
    }

    // Not other trips in progress
    const tripsInProgress = await Trip.findAll({
      where:
      {
        driverId: driverId,
        status: 'in progress',
      }
    })

    if (tripsInProgress){
      return res.status(403).send({ message: 'Cannot make two trips at the same time' });
    }

    // Update status and departureDateTime
    const updatedTrip = await Trip.update({ status: status, departureDateTime: current_date}, {
      where: { tripId: tripId },
    });

    if (updatedTrip == 1) {
      res.status(200).send({ message: "Trip started successfully." });
    } else {
      res.status(404).send({ message: `Cannot update Trip with id=${tripId}.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// PUT update the status of a trip to 'in progress', and update departureDateTime
exports.completeTrip = async (req, res) => {
    try {
      const tripId = req.params.tripId;
      const status = 'completed';
      const driverId = req.userId;
      const current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const trip = await Trip.findByPk(tripId);

      if (!trip) {
        return res.status(404).send({ message: `Cannot find Trip with id=${tripId}.` });
      }

      // Check driverId
      if (trip.driverId !== driverId) {
        return res.status(403).send({ message: 'You are not authorized to update the status of this trip.' });
      }

      // Check trip was started
      if (trip.status !== 'in progress'){
        return res.status(403).send({ message: 'You cannot complete a trip that has not been started.' })
      }

      // Update status and arrivalTime
      const updatedTrip = await Trip.update({ status: status, arrivalDateTime: current_date}, {
        where: { tripId: tripId },
      });

      if (updatedTrip == 1) {
        res.status(200).send({ message: "Trip was completed successfully." });
      } else {
        res.status(404).send({ message: `Cannot update Trip with id=${tripId}.` });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
