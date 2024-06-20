const db = require('../models');

const Trip = db.trip;

async function seedTrips() {
  try {
    await Trip.create({
      publicationId: 1,
      driverId: 'auth0|667209355ff76c5f6ecc52c0',
      status: 'pending',
    });

    await Trip.create({
      publicationId: 2,
      driverId: 'auth0|6672097fdff67714af259298',
      status: 'pending',
    });

    await Trip.create({
      publicationId: 3,
      driverId: 'auth0|6672097fdff67714af259298',
      status: 'pending',
    });
  } catch (error) {
    console.error('Error seeding trips:', error);
  }
}

module.exports = seedTrips;
