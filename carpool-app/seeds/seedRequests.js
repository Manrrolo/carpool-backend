const db = require('../app/models');

const Request = db.request;

function seedRequests() {
  Request.create({
    publicationId: 1,
    passengerId: 2,
    reservationDate: new Date(),
    status: 'pending',
  });

  Request.create({
    publicationId: 2,
    passengerId: 3,
    reservationDate: new Date(),
    status: 'accepted',
  });

  Request.create({
    publicationId: 3,
    passengerId: 2,
    reservationDate: new Date(),
    status: 'rejected',
  });
}

module.exports = { seedRequests };
