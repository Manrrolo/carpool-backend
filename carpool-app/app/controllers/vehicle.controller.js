const db = require('../models');
const Vehicle = db.vehicle;

exports.getVehicles = (req, res) => {
    Vehicle.findAll()
      .then(vehicles => {
        res.status(200).send(vehicles);
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
};

exports.createVehicle = (req, res) => {
    const { userId, brand, model, licensePlate } = req.body;
    Vehicle.create ( {userId, brand, model, licensePlate})
        .then( vehicle => {
            res.status(201).send(vehicle);
        })
        .catch(err => {
            res.status(500).send({ message: err.message});
        });
};

exports.updateVehicle = (req, res) => {
    const id = req.params.id;
    const { userId, brand, model, licensePlate} = req.body;

    Vehicle.update ( {userId, brand, model, licensePlate}, {
        where: {vehicleId: id}
    })
    .then( num => {
        if (num == 1) {
            res.status(200).send({ message: 'Vehicle was updated successfully.'})
        } else {
            res.status(404).send({ message: `Cannot update Vehicle with id=${id}. Maybe Vehicle was not found or req.body is empty!`})
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message})
    })
};

exports.deleteVehicle = (req, res) => {
    const id = req.params.id;

    Vehicle.destroy({
        where: {vehicleId: id}
    })
    .then(num => {
        if (num == 1) {
            res.status(200).send({ message: "Vehicle was deleted successfully!"})
        } else {
            res.status(404).send({ message: `Cannot delete Vehicle with id=${id}. Maybe Vehicle was not found.`})
        }
    })
    .catch(err => {
        res.status(500).send({ message: err.message});
    });
};

exports.getVehicleById = (req, res) => {
    const id = req.params.id;
    Vehicle.findByPk(id)
        .then(vehicle => {
            if (!vehicle) {
                return res.status(404).send({ message: 'Vehicle Not found.'})
            }
            res.status(200).send(vehicle);
        })
        .catch(err => {
            res.status(500).send({ message: err.message});
        });
};

exports.getVehicleByUserId = (req, res) => {
    const userId = req.params.userId;
    Vehicle.findAll({
        where: {
          userId: userId
        }
      })
        .then(vehicles => {
          res.status(200).send(vehicles);
        })
        .catch(err => {
          res.status(500).send({ message: err.message });
        });
}