const express = require('express');
const cors = require('cors');
const process = require('process');
require('dotenv').config();

const app = express();

// const corsOptions = {
//   origin: 'http://localhost:8081',
// };

// app.use(cors(corsOptions));

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require('./app/models');
const seedRoles = require('./app/seeds/seedRoles');
const seedUsers = require('./app/seeds/seedUsers');
const seedPublications = require('./app/seeds/seedPublications');
const seedRequests = require('./app/seeds/seedRequests');
const seedVehicles = require('./app/seeds/seedVehicles');
const seedTrips = require('./app/seeds/seedTrips');
const seedReviews = require('./app/seeds/seedReviews');

async function initializeDatabase() {
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
  } catch (error) {
    console.error('Unable to initialize database:', error);
  }
}

initializeDatabase();

require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/publication.routes')(app);
require('./app/routes/vehicle.routes')(app);
require('./app/routes/request.routes')(app);
require('./app/routes/trip.routes')(app);
require('./app/routes/review.routes')(app);
require('./app/routes/seed.routes')(app);

// simple route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to carpool application!!' });
});

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = { app, server };
