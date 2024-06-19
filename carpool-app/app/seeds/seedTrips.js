const db = require('../models');

const Trip = db.trip;

async function seedTrips() {
  try {
    await Trip.create({
      publicationId: 1,
      userId: 2,
      status: 'pending',
    });

    await Trip.create({
      publicationId: 1,
      userId: 3,
      status: 'pending',
    });

    await Trip.create({
      publicationId: 3,
      userId: 2,
      status: 'pending',
    });

    await Trip.create({
      publicationId: 2,
      userId: 2,
      status: 'pending',
    })
  } catch (error) {
    console.error('Error seeding trips:', error);
  }
}

module.exports = seedTrips;