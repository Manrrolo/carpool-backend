const db = require('../models');

const Request = db.request;

async function seedRequests() {
  try {
    await Request.create({
      publicationId: 1,
      passengerId: 'auth0|667209355ff76c5f6ecc52c0',
      reservationDate: new Date(),
      status: 'pending',
    });

    await Request.create({
      publicationId: 2,
      passengerId: 'auth0|6672097fdff67714af259298',
      reservationDate: new Date(),
      status: 'accepted',
    });

    await Request.create({
      publicationId: 2,
      passengerId: 'auth0|6675237b5aef436d40985d18',
      reservationDate: new Date(),
      status: 'rejected',
    });
  } catch (error) {
    console.error('Error seeding requests:', error);
  }
}

module.exports = seedRequests;
