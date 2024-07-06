const db = require('../models');
const Trip = db.trip;
const Publication = db.publication;
const Request = db.request;
const { DataTypes, Op, where } = require('sequelize');
const User = db.user;

// GET all trips for a driver
exports.getAllTripsForDriver = async (req, res) => {
    // encontrar todas las publicaciones que le pertenecen y luego sus viajes
    try {
      const driverId = req.userId;
      const publications = await Publication.findAll({
          where: {
              driverId: driverId,
          },
          include: [
              {
                  model: Trip,
                  as: 'trips',
                  where: {
                    userId: driverId
                  }
              }
          ]
      });
      const trips = publications.flatMap(publications => publications.trips);
      res.status(200).send(trips);
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
};

// GET trips for a publication, only driver
exports.getTripsForPublication = async (req, res) => {
    const publicationId = req.params.publicationId;
    const driverId = req.userId;

    // validar que la publicacion pertenece al driver
    const publication = await Publication.findByPk(publicationId);
    if (publication.driverId !== driverId) {
      return res.status(403).send({ message: 'You are not authorized to view trips of this publication!.' });
    }

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

// GET info of trip (passengers, driver, status)
exports.getInfoOfTrip = async (req, res) => {
  try {
    const tripId = req.params.tripId
    const trip = await Trip.findByPk(tripId);
    const publication = await Publication.findByPk(trip.publicationId);
    const status = trip.status;
    const passengersTrips = await Trip.findAll({
      attributes: ["status"],
      where: {
        userId: { [Op.ne]: publication.driverId},
        [Op.or]: [{ status: 'in progress'}, { status: 'completed'}]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ["firstName", "lastName"],
        }
      ]
    });
    console.log(publication.driverId);
    const driver = await User.findByPk(publication.driverId);
    res.status(200).send( {
      origin: publication.origin,
      destination: publication.destination,
      departureDateTime: trip.departureDateTime,
      statusTrip: status,
      driver: {firstName: driver.firstName, lastName: driver.lastName},
      passengers: passengersTrips });
  } catch (err) {
    res.status(500).send( { message: err.message});
  }
}

// GET driver trip of a publication, only driver
exports.getDriverTripOfPublication = async (req, res) => {
  const publicationId = req.params.publicationId;
  const driverId = req.userId;

  // validar que la publicacion pertenece al driver
  const publication = await Publication.findByPk(publicationId);
  if (publication.driverId !== driverId) {
    return res.status(403).send({ message: 'You are not authorized to view this trip!.' });
  }

  Trip.findOne({
    where: {
      publicationId: publicationId,
      userId: driverId,
     },
  })
      .then(trip => {
          res.status(200).send(trip);
      })
      .catch(err => {
          res.status(500).send(err.message);
      })
}

// GET all trips for a passenger (si passenger es driver de alguno de esos trips, no se mostrara)
exports.getAllTripsForPassenger = async (req, res) => {
  try {
    const passengerId = req.userId;
    const publications = await Publication.findAll({
      where:{
        driverId: { [Op.ne]: passengerId},
      },
      include: [
        {
          model: Trip,
          as: 'trips',
          where: {userId: passengerId},
        }
      ]
    })

    const trips = publications.flatMap(publications => publications.trips);
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
    const userId = req.userId;

    // verificar que usuario no tiene ya creado un trip de esta publicacion
    const verifyTrip = await Trip.findOne({
      where: {
        userId: userId,
        publicationId: publicationId
      },
    });
    if (verifyTrip){
      return res.status(403).send({ message: 'You can only have one trip for publication!'})
    }

    // si usuario es driver de publicacion se crea, sino hay que verificar que pasajero tenga request aceptada
    const publication = await Publication.findByPk(publicationId);

    if (publication.driverId == userId){
      const trip = await Trip.create({ publicationId: publicationId, userId: userId, status: 'pending'});
      return res.status(201).send(trip);
    }

    // pasajero
    const request = await Request.findOne({
      where: {
        publicationId: publicationId,
        passengerId: userId,
        status: 'accepted',
      }
    })
    console.log(request);
    if (request){
      const trip = await Trip.create({ publicationId: publicationId, userId: userId, status: 'pending'});
      return res.status(201).send(trip);
    } else {
      return res.status(403).send({ message: 'You are not accepted on this trip!'})
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// PUT update the status of a trip to 'in progress', and update departureTime. 
exports.startTrip = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const status = 'in progress';
    const userId = req.userId;
    const current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // existe trip?
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).send({ message: `Cannot find Trip with id=${tripId}.` });
    }

    // Check userId
    if (trip.userId !== userId) {
      return res.status(403).send({ message: 'You are not authorized to update the status of this trip.' });
    }

    // Not other trips in progress
    const tripsInProgress = await Trip.findAll({
      where:
      {
        userId: userId,
        status: 'in progress',
      }
    })

    if (tripsInProgress.length > 1){
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

// PUT update the status of a trip to 'complete', and update arrivalDateTime
exports.completeTrip = async (req, res) => {
    try {
      const tripId = req.params.tripId;
      const status = 'completed';
      const userId = req.userId;
      const current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const trip = await Trip.findByPk(tripId);

      if (!trip) {
        return res.status(404).send({ message: `Cannot find Trip with id=${tripId}.` });
      }

      // Check userId
      if (trip.userId !== userId) {
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