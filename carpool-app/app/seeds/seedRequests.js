const db = require('../models');

const Request = db.request;

async function seedRequests() {
  try {
    await Request.create({
      publicationId: 1,
      passengerId: 2,
      reservationDate: new Date(),
      status: 'pending',
    });

    await Request.create({
      publicationId: 2,
      passengerId: 3,
      reservationDate: new Date(),
      status: 'accepted',
    });

    await Request.create({
      publicationId: 3,
      passengerId: 2,
      reservationDate: new Date(),
      status: 'rejected',
    });
  } catch (error) {
    console.error('Error seeding requests:', error);
  }
}

module.exports = seedRequests;
