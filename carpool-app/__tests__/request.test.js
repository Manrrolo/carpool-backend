// __tests__/request.test.js
const RequestController = require('../app/controllers/request.controller');
const httpMocks = require('node-mocks-http');

// Mock the database models
jest.mock('../app/models', () => ({
  request: {
    findByPk: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  },
  publication: {
    findAll: jest.fn(),
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

      Request.findAll.mockResolvedValue([{ requestId: 1 }, { requestId: 2 }]);

      await RequestController.getRequestsForPublication(req, res);

      expect(Request.findAll).toHaveBeenCalledWith({
        where: { publicationId: 1 }
      });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith([{ requestId: 1 }, { requestId: 2 }]);
    });

    it('should return 500 on database error', async () => {
      const req = httpMocks.createRequest({
        params: {
          publicationId: 1,
        }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Request.findAll.mockRejectedValue(new Error('Database error'));

      await RequestController.getRequestsForPublication(req, res);

      expect(Request.findAll).toHaveBeenCalledWith({
        where: { publicationId: 1 }
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

      Request.create.mockResolvedValue({ requestId: 1 });

      await RequestController.createRequest(req, res);

      expect(Request.create).toHaveBeenCalledWith({
        publicationId: 1,
        passengerId: 1,
        reservationDate: expect.any(Date),
        status: 'pending',
      });
      expect(res.statusCode).toBe(201);
      expect(res.send).toHaveBeenCalledWith({ requestId: 1 });
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

      Request.create.mockRejectedValue(new Error('Database error'));

      await RequestController.createRequest(req, res);

      expect(Request.create).toHaveBeenCalledWith({
        publicationId: 1,
        passengerId: 1,
        reservationDate: expect.any(Date),
        status: 'pending',
      });
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
          driverId: 1,
        },
      };

      Request.findByPk.mockResolvedValue(mockRequest);
      Request.update.mockResolvedValue([1]);
      Trip.create.mockResolvedValue({ tripId: 1, publicationId: 1, userId: 2, status: 'pending' });


      await RequestController.updateRequestStatus(req, res);

      expect(Request.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Publication, as: 'publication' }],
      });
      expect(Request.update).toHaveBeenCalledWith({ status: 'accepted' }, { where: { requestId: 1 } });
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
