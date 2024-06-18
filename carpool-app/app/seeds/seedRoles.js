const db = require('../models');

async function seedRoles() {
  try {
    await db.role.create({ id: 1, name: 'passenger' });
    await db.role.create({ id: 2, name: 'driver' });
    await db.role.create({ id: 3, name: 'admin' });
    console.log('Roles seeded');
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
}

module.exports = seedRoles;
