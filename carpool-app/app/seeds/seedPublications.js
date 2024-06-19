const db = require('../models');

const Publication = db.publication;

async function seedPublications() {
  try {
    await Publication.create({
      driverId: 2,
      driverName: 'John Doe',
      origin: 'Origin Address 1',
      destination: 'Destination Address 1',
      availableSeats: 3,
      cost: 10,
      status: true,
      departureDate: new Date(Date.now() + 6 * 60 * 60 * 1000),
    });

    await Publication.create({
      driverId: 3,
      driverName: 'Jane Doe',
      origin: 'Origin Address 2',
      destination: 'Destination Address 2',
      availableSeats: 4,
      cost: 15,
      status: true,
      departureDate: new Date(Date.now() + 4 * 60 * 60 * 1000),
    });

    await Publication.create({
      driverId: 2,
      driverName: 'John Doe',
      origin: 'Origin Address 3',
      destination: 'Destination Address 3',
      availableSeats: 2,
      cost: 20,
      status: false,
      departureDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // Fixed the typo here
    });
  } catch (error) {
    console.error('Error seeding publications:', error);
  }
}

module.exports = seedPublications;
