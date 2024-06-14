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

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/publication.routes')(app);
require('./app/routes/vehicle.routes')(app);
require('./app/routes/request.routes')(app);

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to carpool application!' });
});

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
