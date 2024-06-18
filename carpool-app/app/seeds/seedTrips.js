const db = require('../models');

const Trip = db.trip;

async function seedTrips() {
  try {
    await Trip.create({
      publicationId: 1,
      driverId: 2,
      status: 'pending',
    });

    await Trip.create({
      publicationId: 2,
      driverId: 3,
      status: 'pending',
    });

    await Trip.create({
      publicationId: 3,
      driverId: 2,
      status: 'pending',
    });
  } catch (error) {
    console.error('Error seeding trips:', error);
  }
}

module.exports = seedTrips;