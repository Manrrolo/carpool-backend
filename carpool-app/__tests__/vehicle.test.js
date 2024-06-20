const VehicleController = require('../app/controllers/vehicle.controller');
const httpMocks = require('node-mocks-http');

// Mock the database models
jest.mock('../app/models', () => ({
  vehicle: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

const { vehicle: Vehicle } = require('../app/models');

describe('Vehicle Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllVehiclesForDriver', () => {
    it('should get all vehicles for a driver', async () => {
      const req = httpMocks.createRequest({
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const vehicles = [{ vehicleId: 1 }, { vehicleId: 2 }];
      Vehicle.findAll.mockResolvedValue(vehicles);

      await VehicleController.getAllVehiclesForDriver(req, res);

      expect(Vehicle.findAll).toHaveBeenCalledWith({
        where: { userId: 1 }
      });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith(vehicles);
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.findAll.mockRejectedValue(new Error('Database error'));

      await VehicleController.getAllVehiclesForDriver(req, res);

      expect(Vehicle.findAll).toHaveBeenCalledWith({
        where: { userId: 1 }
      });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('createVehicle', () => {
    it('should create a new vehicle', async () => {
      const req = httpMocks.createRequest({
        userId: 1,
        body: {
          brand: 'Brand',
          model: 'Model',
          licensePlate: 'ABC-123'
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.create.mockResolvedValue({ vehicleId: 1 });

      await VehicleController.createVehicle(req, res);

      expect(Vehicle.create).toHaveBeenCalledWith({
        userId: 1,
        brand: 'Brand',
        model: 'Model',
        licensePlate: 'ABC-123'
      });
      expect(res.statusCode).toBe(201);
      expect(res.send).toHaveBeenCalledWith({ vehicleId: 1 });
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        userId: 1,
        body: {
          brand: 'Brand',
          model: 'Model',
          licensePlate: 'ABC-123'
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.create.mockRejectedValue(new Error('Database error'));

      await VehicleController.createVehicle(req, res);

      expect(Vehicle.create).toHaveBeenCalledWith({
        userId: 1,
        brand: 'Brand',
        model: 'Model',
        licensePlate: 'ABC-123'
      });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });

    it('should handle missing data', async () => {
      const req = httpMocks.createRequest({
        userId: 1,
        body: {}
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      await VehicleController.createVehicle(req, res);

      expect(res.statusCode).toBe(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'Missing data to create Vehicle.' });
    });
  });

  describe('updateVehicle', () => {
    it('should update a vehicle by ID', async () => {
      const req = httpMocks.createRequest({
        params: { vehicleId: 1 },
        userId: 1,
        body: {
          brand: 'New Brand',
          model: 'New Model',
          licensePlate: 'NEW-123'
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockVehicle = {
        userId: 1
      };

      Vehicle.findByPk.mockResolvedValue(mockVehicle);
      Vehicle.update.mockResolvedValue([1]);

      await VehicleController.updateVehicle(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(Vehicle.update).toHaveBeenCalledWith({
        brand: 'New Brand',
        model: 'New Model',
        licensePlate: 'NEW-123'
      }, { where: { vehicleId: 1 } });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Vehicle was updated successfully.' });
    });

    it('should return 404 if vehicle is not found', async () => {
      const req = httpMocks.createRequest({
        params: { vehicleId: 1 },
        userId: 1,
        body: {
          brand: 'New Brand',
          model: 'New Model',
          licensePlate: 'NEW-123'
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.findByPk.mockResolvedValue(null);

      await VehicleController.updateVehicle(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Cannot find Vehicle with id=1' });
    });

    it('should return 403 if user is not authorized', async () => {
      const req = httpMocks.createRequest({
        params: { vehicleId: 1 },
        userId: 2,
        body: {
          brand: 'New Brand',
          model: 'New Model',
          licensePlate: 'NEW-123'
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockVehicle = {
        userId: 1
      };

      Vehicle.findByPk.mockResolvedValue(mockVehicle);

      await VehicleController.updateVehicle(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(403);
      expect(res.send).toHaveBeenCalledWith({ message: 'You are not authorized to update this vehicle.' });
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        params: { vehicleId: 1 },
        userId: 1,
        body: {
          brand: 'New Brand',
          model: 'New Model',
          licensePlate: 'NEW-123'
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.findByPk.mockRejectedValue(new Error('Database error'));

      await VehicleController.updateVehicle(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('deleteVehicle', () => {
    it('should delete a vehicle by ID', async () => {
      const req = httpMocks.createRequest({
        params: { vehicleId: 1 },
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockVehicle = {
        userId: 1
      };

      Vehicle.findByPk.mockResolvedValue(mockVehicle);
      Vehicle.destroy.mockResolvedValue(1);

      await VehicleController.deleteVehicle(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(Vehicle.destroy).toHaveBeenCalledWith({ where: { vehicleId: 1 } });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Vehicle was deleted successfully!' });
    });

    it('should return 404 if vehicle is not found', async () => {
      const req = httpMocks.createRequest({
        params: { vehicleId: 1 },
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.findByPk.mockResolvedValue(null);

      await VehicleController.deleteVehicle(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Cannot find Vehicle with id=1' });
    });

    it('should return 403 if user is not authorized', async () => {
      const req = httpMocks.createRequest({
        params: { vehicleId: 1 },
        userId: 2
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockVehicle = {
        userId: 1
      };

      Vehicle.findByPk.mockResolvedValue(mockVehicle);

      await VehicleController.deleteVehicle(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(403);
      expect(res.send).toHaveBeenCalledWith({ message: 'You are not authorized to delete this vehicle.' });
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        params: { vehicleId: 1 },
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.findByPk.mockRejectedValue(new Error('Database error'));

      await VehicleController.deleteVehicle(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getVehicleById', () => {
    it('should get a vehicle by ID', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.findByPk.mockResolvedValue({ vehicleId: 1 });

      await VehicleController.getVehicleById(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ vehicleId: 1 });
    });

    it('should return 404 if vehicle is not found', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.findByPk.mockResolvedValue(null);

      await VehicleController.getVehicleById(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Vehicle Not found.' });
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Vehicle.findByPk.mockRejectedValue(new Error('Database error'));

      await VehicleController.getVehicleById(req, res);

      expect(Vehicle.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  // Agrega aquí tests para las otras funciones del controlador de vehículos

});