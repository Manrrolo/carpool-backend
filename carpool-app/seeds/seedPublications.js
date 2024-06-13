const db = require('../app/models');

const Publication = db.publication;

function seedPublications() {
  Publication.create({
    driverId: 1,
    origin: 'Origin Address 1',
    destination: 'Destination Address 1',
    availableSeats: 3,
    cost: 10,
    status: true,
  });

  Publication.create({
    driverId: 2,
    origin: 'Origin Address 2',
    destination: 'Destination Address 2',
    availableSeats: 4,
    cost: 15,
    status: true,
  });

  Publication.create({
    driverId: 1,
    origin: 'Origin Address 3',
    destination: 'Destination Address 3',
    availableSeats: 2,
    cost: 20,
    status: false,
  });
}

module.exports = { seedPublications };