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
      // roles: 3,
      role: 'admin',
      inTrip: false,
    });

    await User.create({
      userId: 'auth0|667209355ff76c5f6ecc52c0',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      // roles: [1, 2],
      role: 'driver',
      inTrip: false,
    });

    await User.create({
      userId: 'auth0|6672097fdff67714af259298',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
      // roles: 1,
      role: 'passenger',
      inTrip: false,
    });

    await User.create({
      userId: 'auth0|6675248501de4d750dcfa352',
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice.s@uc.cl',
      phone: '0987654321',
      role: 'driver',
      inTrip: false,
    });

    await User.create({
      userId: 'auth0|6675237b5aef436d40985d18',
      firstName: 'Javier',
      lastName: 'Hall',
      email: 'javier.h@uc.cl',
      phone: '0987654321',
      role: 'passenger',
      inTrip: false,
    });
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

module.exports = seedUsers;
