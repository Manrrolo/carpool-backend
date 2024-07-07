const db = require('../models');
const Trip = db.trip;
const Publication = db.publication;
const Request = db.request;
const Review = db.review;
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
    const tripId = req.params.tripId;
    const userId = req.userId;

    // Buscar el viaje por ID
    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).send({ message: "Trip not found" });
    }

    // Buscar la publicación relacionada con el viaje
    const publication = await Publication.findByPk(trip.publicationId);
    if (!publication) {
      return res.status(404).send({ message: "Publication not found" });
    }

    const status = trip.status;

    // Buscar los pasajeros que pertenecen a la publicación específica
    const passengersTrips = await Trip.findAll({
      attributes: ["status", "userId"],
      where: {
        publicationId: publication.publicationId,
        userId: { [Op.ne]: publication.driverId },
        [Op.or]: [{ status: 'in progress' }, { status: 'completed' }]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ["firstName", "lastName"],
        }
      ]
    });

    // Buscar la información del conductor
    const driver = await User.findByPk(publication.driverId);
    if (!driver) {
      return res.status(404).send({ message: "Driver not found" });
    }

    // Añadir un flag 'isCurrentUser' a cada pasajero si es el usuario actual
    const passengersWithCurrentUserFlag = passengersTrips.map(passengerTrip => ({
      ...passengerTrip.get({ plain: true }), // Convertir a objeto plano
      isCurrentUser: passengerTrip.userId === userId
    }));

    res.status(200).send({
      origin: publication.origin,
      destination: publication.destination,
      departureDateTime: publication.departureDate,
      statusTrip: status,
      driver: { firstName: driver.firstName, lastName: driver.lastName, isCurrentUser: userId === driver.userId },
      passengers: passengersWithCurrentUserFlag
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

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


// GET info of trip (passengers, driver, status)
exports.getTripById = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const userId = req.userId;

    // Buscar el viaje por ID
    const trip = await Trip.findByPk(tripId);
    if (!trip) {
      return res.status(404).send({ message: "Trip not found" });
    }

    // Buscar la publicación relacionada con el viaje
    const publication = await Publication.findByPk(trip.publicationId);
    if (!publication) {
      return res.status(404).send({ message: "Publication not found" });
    }

    const status = trip.status;

    // Buscar los pasajeros que pertenecen a la publicación específica
    const passengersTrips = await Trip.findAll({
      attributes: ["status", "userId"],
      where: {
        publicationId: publication.publicationId,
        userId: { [Op.ne]: publication.driverId },
        [Op.or]: [{ status: 'in progress' }, { status: 'completed' }]
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ["firstName", "lastName"],
        }
      ]
    });

    // Buscar la información del conductor
    const driver = await User.findByPk(publication.driverId);
    if (!driver) {
      return res.status(404).send({ message: "Driver not found" });
    }

    // Verificar si el usuario es el conductor o uno de los pasajeros
    const isAuthorized = userId === publication.driverId || passengersTrips.some(trip => trip.userId === userId);
    if (!isAuthorized) {
      return res.status(403).send({ message: 'You are not authorized to view this trip.' });
    }

    res.status(200).send({
      origin: publication.origin,
      destination: publication.destination,
      departureDateTime: publication.departureDate,
      statusTrip: status,
      driver: { firstName: driver.firstName, lastName: driver.lastName, isCurrentUser: userId === driver.userId },
      passengers: passengersTrips.map(passengerTrip => ({
        ...passengerTrip.get({ plain: true }), // Convertir a objeto plano
        isCurrentUser: passengerTrip.userId === userId
      }))
    });
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
      // Update the driver's status
      await User.update({ inTrip: true }, { where: { userId: userId } });

      // Find all passengers of the trip and update their status
      const passengersTrips = await Trip.findAll({
        where: {
          publicationId: trip.publicationId,
          userId: { [Op.ne]: userId }
        }
      });

      for (const passengerTrip of passengersTrips) {
        await User.update({ inTrip: true }, { where: { userId: passengerTrip.userId } });
      }

      res.status(200).send({ message: "Trip started successfully." });
    } else {
      res.status(404).send({ message: `Cannot update Trip with id=${tripId}.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


/// PUT update the status of a trip to 'complete', and update arrivalDateTime
exports.completeTrip = async (req, res) => {
  try {
    const tripId = req.params.tripId;
    const status = 'completed';
    const userId = req.userId;
    const current_date = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Buscar el viaje por ID
    const trip = await Trip.findByPk(tripId);

    if (!trip) {
      return res.status(404).send({ message: `Cannot find Trip with id=${tripId}.` });
    }

    // Buscar la publicación relacionada con el viaje
    const publication = await Publication.findByPk(trip.publicationId);
    if (!publication) {
      return res.status(404).send({ message: "Publication not found" });
    }

    // Verificar que el usuario que intenta completar el viaje es el conductor
    if (publication.driverId !== userId) {
      return res.status(403).send({ message: 'You are not authorized to update the status of this trip.' });
    }

    // Verificar que el viaje ha sido iniciado
    if (trip.status !== 'in progress') {
      return res.status(403).send({ message: 'You cannot complete a trip that has not been started.' });
    }

    // Encontrar todos los viajes asociados con la publicación y actualizar su estado a 'completed'
    const [updated] = await Trip.update(
      { status: status, arrivalDateTime: current_date },
      { where: { publicationId: trip.publicationId } }
    );

    if (updated > 0) {
      // Actualizar el estado del conductor
      await User.update({ inTrip: false }, { where: { userId: publication.driverId } });

      // Actualizar el estado de todos los pasajeros
      const passengersTrips = await Trip.findAll({
        where: {
          publicationId: trip.publicationId,
        }
      });

      for (const passengerTrip of passengersTrips) {
        await User.update({ inTrip: false }, { where: { userId: passengerTrip.userId } });
      }

      res.status(200).send({ message: "Trip completed successfully for all related trips." });
    } else {
      res.status(404).send({ message: `Cannot update Trips with publicationId=${trip.publicationId}.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};



/// PUT update the status of a passenger's trip to 'complete', and update arrivalDateTime
exports.completePassengerTrip = async (req, res) => {
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
      return res.status(403).send({ message: 'You cannot complete a trip that has not been started.' });
    }

    // Update status and arrivalTime
    const [updated] = await Trip.update({ status: status, arrivalDateTime: current_date }, {
      where: { tripId: tripId, userId: userId },
    });

    if (updated === 1) {
      await User.update({ inTrip: false }, { where: { userId: userId } });

      res.status(200).send({ message: "Passenger trip completed successfully." });
    } else {
      res.status(404).send({ message: `Cannot update Trip with id=${tripId}.` });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};




  exports.getInProgressTripForUser = async (req, res) => {
    try {
      const userId = req.userId;

      // Buscar un viaje en progreso para el usuario dado
      const trip = await Trip.findOne({
        where: {
          userId: userId,
          status: 'in progress',
        },
      });

      if (trip) {
        res.status(200).send({ tripId: trip.tripId });
      } else {
        res.status(200).send([]);
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };


  exports.getCompletedTripsForUser = async (req, res) => {
    try {
      const userId = req.userId;

      // Buscar viajes completados para el usuario dado
      const completedTrips = await Trip.findAll({
        where: {
          userId: userId,
          status: 'completed',
        },
        include: [
          {
            model: Publication,
            as: 'publication',
            attributes: ['origin', 'destination', 'departureDate'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName'],
          },
        ],
      });

      if (completedTrips.length > 0) {
        const tripsInfo = completedTrips.map((trip) => ({
          tripId: trip.tripId,
          origin: trip.publication.origin,
          destination: trip.publication.destination,
          departureDateTime: trip.publication.departureDate,
          statusTrip: trip.status,
          user: {
            firstName: trip.user.firstName,
            lastName: trip.user.lastName,
          },
        }));
        res.status(200).send(tripsInfo);
      } else {
        res.status(200).send([]);
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  const getUserIdFromGroupId = async (tripId, groupId) => {
    const trip = await Trip.findByPk(tripId, {
      include: [
        {
          model: Publication,
          as: 'publication',
          include: [
            {
              model: User,
              as: 'driver',
              attributes: ['userId', 'firstName', 'lastName'],
            },
          ],
        },
      ],
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    const passengers = await Trip.findAll({
      where: {
        publicationId: trip.publicationId,
        userId: { [Op.ne]: trip.publication.driver.userId },
        [Op.or]: [{ status: 'in progress' }, { status: 'completed' }],
      },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['userId', 'firstName', 'lastName'],
        },
      ],
    });

    const allUsers = [
      trip.publication.driver,
      ...passengers.map((pt) => pt.user),
    ];

    if (groupId < 0 || groupId >= allUsers.length) {
      throw new Error('Invalid groupId');
    }

    return allUsers[groupId].userId;
  };
  exports.getUserProfileByGroupId = async (req, res) => {
    try {
      const { tripId, groupId } = req.params;
      const userId = await getUserIdFromGroupId(tripId, parseInt(groupId, 10));

      // Buscar el usuario por userId
      const user = await User.findOne({
        where: { userId: userId },
      });

      // Si el usuario no existe, devolver error 404
      if (!user) {
        return res
          .status(404)
          .send({ message: `User with userId ${userId} not found.` });
      }

      // Buscar los reviews del usuario
      const reviews = await Review.findAll({
        where: { userId: userId },
      });

      let averageRating = null;
      // Calcular el rating promedio si el usuario tiene reviews
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (acc, review) => acc + review.rating,
          0,
        );
        averageRating = totalRating / reviews.length;
      }

      res.status(200).send({
        user,
        reviews,
        averageRating,
      });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };

  
