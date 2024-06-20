const db = require('../models');
const User = db.user;
const Role = db.role;

const seedUsers = async () => {
  try {
    const admin = await User.create({
      userId: 'auth0|6671d0d41b6ba4f5d852d017',
      firstName: 'Admin',
      lastName: 'Carpool',
      email: 'admin@uc.cl',
      phone: '1234567890',
    });

    const john = await User.create({
      userId: 'auth0|667209355ff76c5f6ecc52c0',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
    });

    const jane = await User.create({
      userId: 'auth0|6672097fdff67714af259298',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
    });

    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    const driverRole = await Role.findOne({ where: { name: 'driver' } });
    const passengerRole = await Role.findOne({ where: { name: 'passenger' } });

    await admin.setRoles([adminRole]);
    await john.setRoles([driverRole]);
    await jane.setRoles([passengerRole]);

    console.log('Users have been seeded');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

module.exports = seedUsers;
