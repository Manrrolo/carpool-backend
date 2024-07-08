const db = require('../models');
const seedRoles = require('../seeds/seedRoles');
const seedUsers = require('../seeds/seedUsers');
const seedPublications = require('../seeds/seedPublications');
const seedRequests = require('../seeds/seedRequests');
const seedVehicles = require('../seeds/seedVehicles');
const seedTrips = require('../seeds/seedTrips');
const seedReviews = require('../seeds/seedReviews');

exports.seedDatabase = async (req, res) => {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Drop and Resync Db');
    await seedRoles();
    await seedUsers();
    await seedPublications();
    await seedRequests();
    await seedVehicles();
    await seedTrips();
    await seedReviews();
    res.status(200).send({ message: 'Database reset and seeds applied successfully.' });
  } catch (error) {
    console.error('Unable to reset database:', error);
    res.status(500).send({ message: 'Unable to reset database.' });
  }
};
