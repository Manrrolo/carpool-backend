const db = require('../models');
const bcrypt = require('bcryptjs');

const User = db.user;

async function seedUsers() {
  try {
    await User.create({
      userId: 'auth0|6671d0d41b6ba4f5d852d017',
      firstName: 'Admin',
      lastName: 'Carpool',
      email: 'admin@uc.cl',
      phone: '1234567890',
      roles: 3,
    });

    await User.create({
      userId: 'auth0|667209355ff76c5f6ecc52c0',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      roles: [1, 2],
    });

    await User.create({
      userId: 'auth0|6672097fdff67714af259298',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      verified: true,
      phone: '0987654321',
      roles: 1,
    });
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

module.exports = seedUsers;
