const db = require('../models');

const Trip = db.trip;

async function seedTrips() {
  try {
    await Trip.create({
      publicationId: 1,
      userId: 'auth0|667209355ff76c5f6ecc52c0',
      status: 'pending',
      departureDateTime: new Date(Date.now() + 6 * 60 * 60 * 1000)
    });

    await Trip.create({
      publicationId: 2,
      userId: 'auth0|6672097fdff67714af259298',
      status: 'pending',
    });

    await Trip.create({
      publicationId: 3,
      userId: 'auth0|6672097fdff67714af259298',
      status: 'pending',
    });

    await Trip.create({
      publicationId: 2,
      userId: 'auth0|667209355ff76c5f6ecc52c0',
      status: 'pending',
    })

    await Trip.create({
      publicationId: 1,
      userId: 'auth0|6671d0d41b6ba4f5d852d017',
      status: 'completed',
      departureDateTime: new Date(Date.now() + 7 * 60 * 60 * 1000),
      arrivalDateTime: new Date(Date.now() + 8 * 60 * 60 * 1000)
    })

    await Trip.create({
      publicationId: 1,
      userId: 'auth0|6672097fdff67714af259298',
      status: 'pending',
      departureDateTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    })
  } catch (error) {
    console.error('Error seeding trips:', error);
  }
}

module.exports = seedTrips;
