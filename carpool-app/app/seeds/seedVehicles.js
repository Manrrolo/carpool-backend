const db = require('../models');

const Vehicle = db.vehicle;

function seedVehicles() {
  Vehicle.create({
    userId: 'auth0|667209355ff76c5f6ecc52c0',
    brand: 'Brand 1',
    model: 'Model 1',
    licensePlate: 'AA-AA-11',
  });

  Vehicle.create({
    userId: 'auth0|667209355ff76c5f6ecc52c0',
    brand: 'Brand 2',
    model: 'Model 2',
    licensePlate: 'BB-BB-22',
  });

  Vehicle.create({
    userId: 'auth0|667209355ff76c5f6ecc52c0',
    brand: 'Brand 3',
    model: 'Model 3',
    licensePlate: 'CC-CC-33',
  });
}

module.exports = seedVehicles;
