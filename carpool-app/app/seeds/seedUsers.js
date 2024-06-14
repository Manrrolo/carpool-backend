const db = require('../models');
const bcrypt = require('bcryptjs');

const User = db.user;

async function seedUsers() {
  try {
    await User.create({
      firstName: 'Admin',
      lastName: 'Admin',
      password: bcrypt.hashSync('admin', 10),
      email: 'admin@uc.cl',
      verified: true,
      phone: '1234567890',
      role: 'admin'
    });

    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      password: bcrypt.hashSync('123', 10),
      email: 'john.doe@example.com',
      verified: true,
      phone: '1234567890',
      role: 'driver'
    });

    await User.create({
      firstName: 'Jane',
      lastName: 'Doe',
      password: bcrypt.hashSync('123', 10),
      email: 'jane.doe@example.com',
      verified: true,
      phone: '0987654321',
      role: 'passenger'
    });
  } catch (error) {
    console.error('Error seeding users:', error);
  }
}

module.exports = seedUsers;
