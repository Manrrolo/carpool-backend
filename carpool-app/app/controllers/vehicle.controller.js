const db = require('../models');
const Vehicle = db.vehicle;

exports.getAllVehiclesForDriver = async (req, res) => {
    try {
        const driverId = req.userId;
        const vehicles = await Vehicle.findAll({
            where: { userId: driverId },
        });
        res.status(200).send(vehicles);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.createVehicle = async (req, res) => {
    try {
        const userId = req.userId;
        const { brand, model, licensePlate } = req.body;

        if (!userId || !brand || !model || !licensePlate) {
            return res.status(400).send({ message: "Missing data to create Vehicle." });
        }

        const vehicle = await Vehicle.create({ userId, brand, model, licensePlate });
        res.status(201).send(vehicle);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.updateVehicle = async (req, res) => {
    const vehicleId = req.params.vehicleId;
    const userId = req.userId;
    const { brand, model, licensePlate } = req.body;

    try {
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).send({ message: `Cannot find Vehicle with id=${vehicleId}` });
        }

        // Check driver
        if (vehicle.userId !== userId) {
            return res.status(403).send({ message: `You are not authorized to update this vehicle.` });
        }

        // Update vehicle
        const [numUpdated] = await Vehicle.update(
            { brand, model, licensePlate },
            { where: { vehicleId: vehicleId } }
        );

        if (numUpdated === 1) {
            res.status(200).send({ message: 'Vehicle was updated successfully.' });
        } else {
            res.status(404).send({ message: `Cannot update Vehicle with id=${vehicleId}. Maybe Vehicle was not found or req.body is empty!` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.deleteVehicle = async (req, res) => {
    const vehicleId = req.params.vehicleId;
    const userId = req.userId;

    try {
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).send({ message: `Cannot find Vehicle with id=${vehicleId}` });
        }

        // Check driver authorization
        if (vehicle.userId !== userId) {
            return res.status(403).send({ message: `You are not authorized to delete this vehicle.` });
        }

        const numDeleted = await Vehicle.destroy({
            where: { vehicleId: vehicleId }
        });

        if (numDeleted === 1) {
            res.status(200).send({ message: "Vehicle was deleted successfully!" });
        } else {
            res.status(404).send({ message: `Cannot delete Vehicle with id=${vehicleId}. Maybe Vehicle was not found.` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getVehicleById = async (req, res) => {
    try {
        const id = req.params.id;
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            return res.status(404).send({ message: 'Vehicle Not found.' });
        }
        res.status(200).send(vehicle);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};