const express = require('express');
const cors = require('cors');
const process = require('process');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
<<<<<<< HEAD

const Role = db.role;

function seedRoles() {
  Role.create({
    id: 1,
    name: 'passenger',
  });

  Role.create({
    id: 2,
    name: 'driver',
  });

  Role.create({
    id: 3,
    name: 'admin',
  });
}

// Seeds
const seedsUsers = require('./seeds/seedUsers');
const seedsPublications = require('./seeds/seedPublications');
const seedsVehicles = require('./seeds/seedVehicles');
const seedsRequests = require('./seeds/seedRequests');

db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync Db');
  seedRoles();
  seedsUsers.seedUsers();
  seedsPublications.seedPublications();
  seedsVehicles.seedVehicles();
  seedsRequests.seedRequests();
});
=======
const seedRoles = require('./app/seeds/seedRoles'); // Importar la semilla de roles
const seedUsers = require('./app/seeds/seedUsers');
const seedPublications = require('./app/seeds/seedPublications');
const seedRequests = require('./app/seeds/seedRequests');

async function initializeDatabase() {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Drop and Resync Db');
    await seedRoles();
    await seedUsers();
    await seedPublications();
    await seedRequests();
  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
}

initializeDatabase()
>>>>>>> a92043241937000d594d9b273edd704d57e4881a

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/publication.routes')(app);
<<<<<<< HEAD
require('./app/routes/vehicle.routes')(app);
=======
>>>>>>> a92043241937000d594d9b273edd704d57e4881a
require('./app/routes/request.routes')(app);

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to carpool application!' });
});

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = { app, server };
