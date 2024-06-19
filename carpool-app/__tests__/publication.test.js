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
  user: {
    findByPk: jest.fn(),
  }
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

      const publications = [{ publicationId: 1 }, { publicationId: 2 }];
      Publication.findAll.mockResolvedValue(publications);

      await PublicationController.getAllPublications(req, res);

      expect(Publication.findAll).toHaveBeenCalled();
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith(publications);
    });

    it('should handle errors', async () => {
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
        params: { id: 1 }
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
        params: { id: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockResolvedValue(null);

      await PublicationController.getPublicationById(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Publication Not found.' });
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 }
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
    it('should get all publications by user ID', async () => {
      const req = httpMocks.createRequest({
        params: { driverId: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const publications = [{ publicationId: 1 }, { publicationId: 2 }];
      Publication.findAll.mockResolvedValue(publications);

      await PublicationController.getPublicationsByUserId(req, res);

      expect(Publication.findAll).toHaveBeenCalledWith({
        where: { driverId: 1 }
      });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith(publications);
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        params: { driverId: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findAll.mockRejectedValue(new Error('Database error'));

      await PublicationController.getPublicationsByUserId(req, res);

      expect(Publication.findAll).toHaveBeenCalledWith({
        where: { driverId: 1 }
      });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('createPublication', () => {
    it('should create a new publication', async () => {
      const req = httpMocks.createRequest({
        body: {
          origin: 'Origin',
          destination: 'Destination',
          availableSeats: 3,
          cost: 100,
          driverName: 'John Doe',
          departureDate: new Date()
        },
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.create.mockResolvedValue({ publicationId: 1 });

      await PublicationController.createPublication(req, res);

      expect(Publication.create).toHaveBeenCalledWith({
        driverId: 1,
        driverName: 'John Doe',
        origin: 'Origin',
        destination: 'Destination',
        availableSeats: 3,
        cost: 100,
        status: false,
        departureDate: expect.any(Date)
      });
      expect(res.statusCode).toBe(201);
      expect(res.send).toHaveBeenCalledWith({ publicationId: 1 });
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        body: {
          origin: 'Origin',
          destination: 'Destination',
          availableSeats: 3,
          cost: 100,
          driverName: 'John Doe',
          departureDate: new Date()
        },
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.create.mockRejectedValue(new Error('Database error'));

      await PublicationController.createPublication(req, res);

      expect(Publication.create).toHaveBeenCalledWith({
        driverId: 1,
        driverName: 'John Doe',
        origin: 'Origin',
        destination: 'Destination',
        availableSeats: 3,
        cost: 100,
        status: false,
        departureDate: expect.any(Date)
      });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('updatePublication', () => {
    it('should update a publication by ID', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 },
        body: {
          origin: 'New Origin',
          destination: 'New Destination',
          availableSeats: 4,
          cost: 120,
          status: true,
          departureDate: new Date()
        },
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = {
        driverId: 1
      };

      Publication.findByPk.mockResolvedValue(mockPublication);
      Publication.update.mockResolvedValue([1]);

      await PublicationController.updatePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(Publication.update).toHaveBeenCalledWith({
        origin: 'New Origin',
        destination: 'New Destination',
        availableSeats: 4,
        cost: 120,
        status: true,
        departureDate: expect.any(Date)
      }, { where: { id: 1 } });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Publication was updated successfully.' });
    });

    it('should return 404 if publication is not found', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 },
        body: {
          origin: 'New Origin',
          destination: 'New Destination',
          availableSeats: 4,
          cost: 120,
          status: true,
          departureDate: new Date()
        },
        userId: 1
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
        params: { id: 1 },
        body: {
          origin: 'New Origin',
          destination: 'New Destination',
          availableSeats: 4,
          cost: 120,
          status: true,
          departureDate: new Date()
        },
        userId: 2
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = {
        driverId: 1
      };

      Publication.findByPk.mockResolvedValue(mockPublication);

      await PublicationController.updatePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(403);
      expect(res.send).toHaveBeenCalledWith({ message: 'You are not authorized to update this publication.' });
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 },
        body: {
          origin: 'New Origin',
          destination: 'New Destination',
          availableSeats: 4,
          cost: 120,
          status: true,
          departureDate: new Date()
        },
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockRejectedValue(new Error('Database error'));

      await PublicationController.updatePublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

});