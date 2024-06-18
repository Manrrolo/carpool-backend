const db = require('../models');

const Publication = db.publication;

async function seedPublications() {
  try {
    await Publication.create({
      driverId: 'auth0|667209355ff76c5f6ecc52c0',
      origin: 'Origin Address 1',
      destination: 'Destination Address 1',
      availableSeats: 3,
      cost: 10,
      status: true,
    });

    await Publication.create({
      driverId: 'auth0|6672097fdff67714af259298',
      origin: 'Origin Address 2',
      destination: 'Destination Address 2',
      availableSeats: 4,
      cost: 15,
      status: true,
    });

    await Publication.create({
      driverId: 'auth0|667209355ff76c5f6ecc52c0',
      origin: 'Origin Address 3',
      destination: 'Destination Address 3',
      availableSeats: 2,
      cost: 20,
      status: false,
    });
  } catch (error) {
    console.error('Error seeding publications:', error);
  }
}

module.exports = seedPublications;
