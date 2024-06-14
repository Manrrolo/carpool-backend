const db = require('../app/models');
const bcrypt = require('bcryptjs');

const User = db.user;

function seedUsers() {
  User.create({
    firstName: 'Admin',
    lastName: 'User',
    password: bcrypt.hashSync('admin', 10),
    email: 'admin@uc.cl',
    verified: true,
    phone: '1234567890',
    role: 'admin',
    created_at: new Date(),
  });

  User.create({
    firstName: 'John',
    lastName: 'Doe',
    password: bcrypt.hashSync('123', 10),
    email: 'john.doe@example.com',
    verified: true,
    phone: '1234567890',
    role: 'driver',
    created_at: new Date(),
  });

  User.create({
    firstName: 'Jane',
    lastName: 'Doe',
    password: bcrypt.hashSync('123', 10),
    email: 'jane.doe@example.com',
    verified: true,
    phone: '0987654321',
    role: 'passenger',
    created_at: new Date(),
  });
}

module.exports = { seedUsers };
