// __tests__/request.test.js
const RequestController = require('../app/controllers/request.controller');
const httpMocks = require('node-mocks-http');

// Mock the database models
jest.mock('../app/models', () => ({
  request: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  },
  publication: {
    findAll: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
  },
  trip: {
    create: jest.fn(),
  }
}));

const { request: Request, publication: Publication, trip: Trip } = require('../app/models');

describe('Request Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRequestById', () => {
    it('should get a request by ID', async () => {
      const req = httpMocks.createRequest({
        params: {
          requestId: 1,
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Request.findByPk.mockResolvedValue({ requestId: 1 });

      await RequestController.getRequestById(req, res);

      expect(Request.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ requestId: 1 });
    });

    it('should return 404 if request is not found', async () => {
      const req = httpMocks.createRequest({
        params: {
          requestId: 1,
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Request.findByPk.mockResolvedValue(null);

      await RequestController.getRequestById(req, res);

      expect(Request.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Request Not found.' });
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        params: {
          requestId: 1,
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Request.findByPk.mockRejectedValue(new Error('Database error'));

      await RequestController.getRequestById(req, res);

      expect(Request.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getAllRequestsForDriver', () => {
    it('should get all requests for a driver', async () => {
      const req = httpMocks.createRequest({
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findAll.mockResolvedValue([
        {
          requests: [{ requestId: 1 }, { requestId: 2 }]
        }
      ]);

      await RequestController.getAllRequestsForDriver(req, res);

      expect(Publication.findAll).toHaveBeenCalledWith({
        where: { driverId: 1 },
        include: [
          {
            model: Request,
            as: 'requests'
          }
        ]
      });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith([{ requestId: 1 }, { requestId: 2 }]);
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findAll.mockRejectedValue(new Error('Database error'));

      await RequestController.getAllRequestsForDriver(req, res);

      expect(Publication.findAll).toHaveBeenCalledWith({
        where: { driverId: 1 },
        include: [
          {
            model: Request,
            as: 'requests'
          }
        ]
      });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getRequestsForPublication', () => {
    it('should get all requests for a publication', async () => {
      const req = httpMocks.createRequest({
        params: {
          publicationId: 1,
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = {
        requests: [{ requestId: 1 }, { requestId: 2 }],
        availableSeats: 3
      };

      Publication.findByPk.mockResolvedValue(mockPublication);

      await RequestController.getRequestsForPublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1, {
        include: [
          {
            model: Request,
            as: 'requests',
            include: [
              {
                model: undefined,
                as: 'passenger',
                attributes: ['userId', 'firstName', 'lastName', 'email', 'phone'],
              }
            ]
          }
        ]
      });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({
        requests: mockPublication.requests,
        availableSeats: mockPublication.availableSeats
      });
    });

    it('should return 404 if publication is not found', async () => {
      const req = httpMocks.createRequest({
        params: {
          publicationId: 1,
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockResolvedValue(null);

      await RequestController.getRequestsForPublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1, {
        include: [
          {
            model: Request,
            as: 'requests',
            include: [
              {
                model: undefined,
                as: 'passenger',
                attributes: ['userId', 'firstName', 'lastName', 'email', 'phone'],
              }
            ]
          }
        ]
      });
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Publication not found.' });
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        params: {
          publicationId: 1,
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockRejectedValue(new Error('Database error'));

      await RequestController.getRequestsForPublication(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1, {
        include: [
          {
            model: Request,
            as: 'requests',
            include: [
              {
                model: undefined,
                as: 'passenger',
                attributes: ['userId', 'firstName', 'lastName', 'email', 'phone'],
              }
            ]
          }
        ]
      });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('getAllRequestsForPassenger', () => {
    it('should get all requests for a passenger', async () => {
      const req = httpMocks.createRequest({
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Request.findAll.mockResolvedValue([{ requestId: 1 }, { requestId: 2 }]);

      await RequestController.getAllRequestsForPassenger(req, res);

      expect(Request.findAll).toHaveBeenCalledWith({
        where: { passengerId: 1 }
      });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith([{ requestId: 1 }, { requestId: 2 }]);
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Request.findAll.mockRejectedValue(new Error('Database error'));

      await RequestController.getAllRequestsForPassenger(req, res);

      expect(Request.findAll).toHaveBeenCalledWith({
        where: { passengerId: 1 }
      });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('createRequest', () => {
    it('should create a new request for a publication', async () => {
      const req = httpMocks.createRequest({
        body: {
          publicationId: 1,
          reservationDate: new Date(),
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = { publicationId: 1, availableSeats: 3 };

      Publication.findByPk.mockResolvedValue(mockPublication);
      Request.findOne.mockResolvedValue(null);
      Request.create.mockResolvedValue({ requestId: 1 });

      await RequestController.createRequest(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(Request.create).toHaveBeenCalledWith({
        publicationId: 1,
        passengerId: 1,
        reservationDate: expect.any(Date),
        status: 'pending',
      });
      expect(res.statusCode).toBe(201);
      expect(res.send).toHaveBeenCalledWith({ requestId: 1 });
    });

    it('should return 400 if no available seats', async () => {
      const req = httpMocks.createRequest({
        body: {
          publicationId: 1,
          reservationDate: new Date(),
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockResolvedValue({ availableSeats: 0 });

      await RequestController.createRequest(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'No available seats.' });
    });

    it('should return 400 if passenger already requested this publication', async () => {
      const req = httpMocks.createRequest({
        body: {
          publicationId: 1,
          reservationDate: new Date(),
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockPublication = { availableSeats: 3 };
      Publication.findByPk.mockResolvedValue(mockPublication);
      Request.findOne.mockResolvedValue({ requestId: 1 });

      await RequestController.createRequest(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(Request.findOne).toHaveBeenCalledWith({
        where: { publicationId: 1, passengerId: 1 }
      });
      expect(res.statusCode).toBe(400);
      expect(res.send).toHaveBeenCalledWith({ message: 'You have already requested this publication.' });
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        body: {
          publicationId: 1,
          reservationDate: new Date(),
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Publication.findByPk.mockRejectedValue(new Error('Database error'));

      await RequestController.createRequest(req, res);

      expect(Publication.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

  describe('updateRequestStatus', () => {
    it('should update the status of a request by the driver', async () => {
      const req = httpMocks.createRequest({
        params: {
          requestId: 1,
        },
        body: {
          status: 'accepted',
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockRequest = {
        publication: {
          publicationId: 1,
          driverId: 1,
          availableSeats: 3
        },
        passengerId: 2
      };

      Request.findByPk.mockResolvedValue(mockRequest);
      Request.update.mockResolvedValue([1]);
      Trip.create.mockResolvedValue({ tripId: 1, publicationId: 1, userId: 2, status: 'pending' });
      Publication.update.mockResolvedValue([1]);

      await RequestController.updateRequestStatus(req, res);

      expect(Request.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Publication, as: 'publication' }],
      });
      expect(Request.update).toHaveBeenCalledWith({ status: 'accepted' }, { where: { requestId: 1 } });
      expect(Publication.update).toHaveBeenCalledWith(
        { availableSeats: mockRequest.publication.availableSeats - 1 },
        { where: { publicationId: mockRequest.publication.publicationId } }
      );
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Request status was updated successfully.' });
    });

    it('should return 404 if request is not found', async () => {
      const req = httpMocks.createRequest({
        params: {
          requestId: 1,
        },
        body: {
          status: 'accepted',
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Request.findByPk.mockResolvedValue(null);

      await RequestController.updateRequestStatus(req, res);

      expect(Request.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Publication, as: 'publication' }],
      });
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: `Cannot find Request with id=${1}.` });
    });

    it('should return 403 if user is not authorized', async () => {
      const req = httpMocks.createRequest({
        params: {
          requestId: 1,
        },
        body: {
          status: 'accepted',
        },
        userId: 2,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockRequest = {
        publication: {
          driverId: 1,
        },
      };

      Request.findByPk.mockResolvedValue(mockRequest);

      await RequestController.updateRequestStatus(req, res);

      expect(Request.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Publication, as: 'publication' }],
      });
      expect(res.statusCode).toBe(403);
      expect(res.send).toHaveBeenCalledWith({ message: 'You are not authorized to update the status of this request.' });
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        params: {
          requestId: 1,
        },
        body: {
          status: 'accepted',
        },
        userId: 1,
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Request.findByPk.mockRejectedValue(new Error('Database error'));

      await RequestController.updateRequestStatus(req, res);

      expect(Request.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Publication, as: 'publication' }],
      });
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
