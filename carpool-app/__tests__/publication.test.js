// __tests__/publication.test.js
const PublicationController = require('../app/controllers/publication.controller');
const httpMocks = require('node-mocks-http');

// Mock the database models
jest.mock('../app/models', () => ({
  publication: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

const { publication: Publication } = require('../app/models');

describe('Publication Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPublications', () => {
    it('should get all publications', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findAll.mockResolvedValue([{ publicationId: 1 }, { publicationId: 2 }]);

      await PublicationController.getAllPublications(req, res);

      expect(Publication.findAll).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith([{ publicationId: 1 }, { publicationId: 2 }]);
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findAll.mockRejectedValue(new Error('Database error'));

      await PublicationController.getAllPublications(req, res);

      expect(Publication.findAll).toHaveBeenCalled();
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getPublicationById', () => {
    it('should get a publication by ID', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockResolvedValue({ publicationId: 1 });

      await PublicationController.getPublicationById(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ publicationId: 1 });
    });

    it('should return 404 if publication is not found', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockResolvedValue(null);

      await PublicationController.getPublicationById(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Publication Not found.' });
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockRejectedValue(new Error('Database error'));

      await PublicationController.getPublicationById(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getPublicationsByUserId', () => {
    it('should get all publications for a user', async () => {
      const req = httpMocks.createRequest({
        params: {
          driverId: 1,
        },
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findAll.mockResolvedValue([{ publicationId: 1 }, { publicationId: 2 }]);

      await PublicationController.getPublicationsByUserId(req, res);

      expect(Publication.findAll).toHaveBeenCalledWith({ where: { driverId: 1 } });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith([{ publicationId: 1 }, { publicationId: 2 }]);
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        params: {
          driverId: 1,
        },
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findAll.mockRejectedValue(new Error('Database error'));

      await PublicationController.getPublicationsByUserId(req, res);

      expect(Publication.findAll).toHaveBeenCalledWith({ where: { driverId: 1 } });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('createPublication', () => {
    it('should create a new publication', async () => {
      const req = httpMocks.createRequest({
        body: {
          origin: 'Origin Address',
          destination: 'Destination Address',
          availableSeats: 3,
          cost: 10,
          departureDate: new Date(),
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.create.mockResolvedValue({ publicationId: 1 });

      await PublicationController.createPublication(req, res);

      expect(Publication.create).toHaveBeenCalledWith({
        driverId: 1,
        driverName: undefined,
        origin: 'Origin Address',
        destination: 'Destination Address',
        availableSeats: 3,
        cost: 10,
        status: false,
        departureDate: expect.any(Date),
      });
      expect(res.statusCode).toBe(201);
      expect(res.send).toHaveBeenCalledWith({ publicationId: 1 });
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        body: {
          origin: 'Origin Address',
          destination: 'Destination Address',
          availableSeats: 3,
          cost: 10,
          departureDate: new Date(),
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.create.mockRejectedValue(new Error('Database error'));

      await PublicationController.createPublication(req, res);

      expect(Publication.create).toHaveBeenCalledWith({
        driverId: 1,
        driverName: undefined,
        origin: 'Origin Address',
        destination: 'Destination Address',
        availableSeats: 3,
        cost: 10,
        status: false,
        departureDate: expect.any(Date),
      });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('updatePublication', () => {
    it('should update an existing publication', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
        body: {
          origin: 'New Origin Address',
          destination: 'New Destination Address',
          availableSeats: 2,
          cost: 15,
          status: true,
          departureDate: new Date(),
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = {
        driverId: 1,
      };

      Publication.findByPk.mockResolvedValue(mockPublication);
      Publication.update.mockResolvedValue([1]);

      await PublicationController.updatePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(Publication.update).toHaveBeenCalledWith(
        {
          origin: 'New Origin Address',
          destination: 'New Destination Address',
          availableSeats: 2,
          cost: 15,
          status: true,
          departureDate: expect.any(Date),
        },
        { where: { id: 1 } },
      );
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Publication was updated successfully.' });
    });

    it('should return 404 if publication is not found', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
        body: {
          origin: 'New Origin Address',
          destination: 'New Destination Address',
          availableSeats: 2,
          cost: 15,
          status: true,
          departureDate: new Date(),
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockResolvedValue(null);

      await PublicationController.updatePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Publication Not found.' });
    });

    it('should return 403 if user is not authorized', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
        body: {
          origin: 'New Origin Address',
          destination: 'New Destination Address',
          availableSeats: 2,
          cost: 15,
          status: true,
          departureDate: new Date(),
        },
        userId: 2,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = {
        driverId: 1,
      };

      Publication.findByPk.mockResolvedValue(mockPublication);

      await PublicationController.updatePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(403);
      expect(res.send).toHaveBeenCalledWith({ message: 'You can only update your own publications.' });
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
        body: {
          origin: 'New Origin Address',
          destination: 'New Destination Address',
          availableSeats: 2,
          cost: 15,
          status: true,
          departureDate: new Date(),
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = {
        driverId: 1,
      };

      Publication.findByPk.mockResolvedValue(mockPublication);
      Publication.update.mockRejectedValue(new Error('Database error'));

      await PublicationController.updatePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(Publication.update).toHaveBeenCalledWith(
        {
          origin: 'New Origin Address',
          destination: 'New Destination Address',
          availableSeats: 2,
          cost: 15,
          status: true,
          departureDate: expect.any(Date),
        },
        { where: { id: 1 } },
      );
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('deletePublication', () => {
    it('should delete an existing publication', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = {
        driverId: 1,
      };

      Publication.findByPk.mockResolvedValue(mockPublication);
      Publication.destroy.mockResolvedValue(1);

      await PublicationController.deletePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(Publication.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Publication was deleted successfully!' });
    });

    it('should return 404 if publication is not found', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockResolvedValue(null);

      await PublicationController.deletePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Publication Not found.' });
    });

    it('should return 403 if user is not authorized', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
        userId: 2,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = {
        driverId: 1,
      };

      Publication.findByPk.mockResolvedValue(mockPublication);

      await PublicationController.deletePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(403);
      expect(res.send).toHaveBeenCalledWith({ message: 'You can only delete your own publications.' });
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        params: {
          id: 1,
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = {
        driverId: 1,
      };

      Publication.findByPk.mockResolvedValue(mockPublication);
      Publication.destroy.mockRejectedValue(new Error('Database error'));

      await PublicationController.deletePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(Publication.destroy).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
