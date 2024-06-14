const db = require('../models');

const Publication = db.publication;

async function seedPublications() {
  try {
    await Publication.create({
      driverId: 2,
      origin: 'Origin Address 1',
      destination: 'Destination Address 1',
      availableSeats: 3,
      cost: 10,
      status: true,
    });

    await Publication.create({
      driverId: 3,
      origin: 'Origin Address 2',
      destination: 'Destination Address 2',
      availableSeats: 4,
      cost: 15,
      status: true,
    });

    await Publication.create({
      driverId: 2,
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
