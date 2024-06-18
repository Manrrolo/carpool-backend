const db = require('../models');
const Vehicle = db.vehicle;

exports.getAllVehiclesForDriver = (req, res) => {
    const driverId = req.userId;

    Vehicle.findAll({
        where: { userId: driverId},
    })
      .then(vehicles => {
        res.status(200).send(vehicles);
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
};

exports.createVehicle = (req, res) => {
    const userId = req.userId;
    const { brand, model, licensePlate } = req.body;

    if (!userId || !brand || !model || !licensePlate){
        return res.status(400).send({ message: "Missing data to create Vehicle."})
    }



    Vehicle.create ( {userId, brand, model, licensePlate})
        .then( vehicle => {
            res.status(201).send(vehicle);
        })
        .catch(err => {
            res.status(500).send({ message: err.message});
        });
};

exports.updateVehicle = async (req, res) => {
    const vehicleId = req.params.vehicleId;
    const userId = req.userId;
    const { brand, model, licensePlate} = req.body;

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle){
        return res.status(404).send( {message: `Cannot find Vehicle with id=${vehicleId}`})
    }

    // Check driver
    if (vehicle.userId !== userId){
        return res.status(403).send( {message: `You are not authorized to update this vehicle.`})
    }

    // update

    Vehicle.update ( {brand, model, licensePlate}, {
        where: {vehicleId: vehicleId}
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

exports.deleteVehicle = async (req, res) => {
    const vehicleId = req.params.vehicleId;
    const userId = req.userId;

    const vehicle = await Vehicle.findByPk(vehicleId);
    if (!vehicle){
        return res.status(404).send( {message: `Cannot find Vehicle with id=${vehicleId}`})
    }

    // Check driver
    if (vehicle.userId !== userId){
        return res.status(403).send( {message: `You are not authorized to delete this vehicle.`})
    }

    Vehicle.destroy({
        where: {vehicleId: vehicleId}
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