const db = require('../models');

const Publication = db.publication;

async function seedPublications() {
  try {
    await Publication.create({
      driverId: 'auth0|667209355ff76c5f6ecc52c0',
      // driverName: 'John Doe',
      origin: 'Origin Address 1',
      destination: 'Destination Address 1',
      availableSeats: 3,
      cost: 10,
      status: true,
      departureDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
    });

    await Publication.create({
      driverId: 'auth0|667209355ff76c5f6ecc52c0',
      // driverName: 'John Doe',
      origin: 'Origin Address 3',
      destination: 'Destination Address 3',
      availableSeats: 2,
      cost: 20,
      status: false,
      departureDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
    });
  } catch (error) {
    console.error('Error seeding publications:', error);
  }
}

module.exports = seedPublications;
