const db = require('../app/models');

const User = db.user;

function seedUsers() {
  User.create({
    userId: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    verified: true,
    phone: '1234567890',
    role: 'driver',
    created_at: new Date(),
  });

  User.create({
    userId: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane.doe@example.com',
    verified: true,
    phone: '0987654321',
    role: 'passenger',
    created_at: new Date(),
  });
}

module.exports = { seedUsers };
