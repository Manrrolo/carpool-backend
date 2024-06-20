const ReviewController = require('../app/controllers/review.controller');
const httpMocks = require('node-mocks-http');

// Mock the database models
jest.mock('../app/models', () => ({
  review: {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn(),
    destroy: jest.fn(),
    update: jest.fn(),
  }
}));

const { review: Review, trip } = require('../app/models');

describe('Review Controller', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllReviewsByUser', () => {
    it('should get all reviews of a user', async () => {
      const req = httpMocks.createRequest({
        params: { userId: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const reviews = [{ id: 1 }, { id: 2 }];
      Review.findAll.mockResolvedValue(reviews);

      await ReviewController.getAllReviewsByUser(req, res);

      expect(Review.findAll).toHaveBeenCalledWith({ where: { userId: 1 } });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith(reviews);
    });

    it('should handle errors', async () => {
        const req = httpMocks.createRequest({
            params: { userId: 1 }
        });
        const res = httpMocks.createResponse();
        res.send = jest.fn();

        Review.findAll.mockRejectedValue(new Error('Database error'));

        await ReviewController.getAllReviewsByUser(req, res);

        expect(Review.findAll).toHaveBeenCalledWith({
          where: { userId: 1 }
        });
        expect(res.statusCode).toBe(500);
        expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
      });

  });

  describe('getAllReviewsByTrip', () => {
    it('should get all reviews of a trip', async () => {
      const req = httpMocks.createRequest({
        params: { tripId: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const reviews = [{ id: 1 }, { id: 2 }];
      Review.findAll.mockResolvedValue(reviews);

      await ReviewController.getAllReviewsByTrip(req, res);

      expect(Review.findAll).toHaveBeenCalledWith({ where: { tripId: 1 } });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith(reviews);
    });

    it('should handle errors', async () => {
        const req = httpMocks.createRequest({
            params: { tripId: 1 }
        });
        const res = httpMocks.createResponse();
        res.send = jest.fn();

        Review.findAll.mockRejectedValue(new Error('Database error'));

        await ReviewController.getAllReviewsByTrip(req, res);

        expect(Review.findAll).toHaveBeenCalledWith({
          where: { tripId: 1 }
        });
        expect(res.statusCode).toBe(500);
        expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
      });
  });

  describe('createReview', () => {
    it('should create a new review', async () => {
      const req = httpMocks.createRequest({
        userId: 1,
        body: { tripId: 1, rating: 5, comment: 'Great experience' }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Review.create.mockResolvedValue({ reviewId: 1 });

      await ReviewController.createReview(req, res);

      expect(Review.create).toHaveBeenCalledWith({ userId: 1, tripId: 1, rating: 5, comment: 'Great experience' });
      expect(res.statusCode).toBe(201);
      expect(res.send).toHaveBeenCalledWith({ reviewId: 1 });
    });

    it('should handle errors', async () => {
        const req = httpMocks.createRequest({
            userId: 1,
            body: { tripId: 1, rating: 5, comment: 'Great experience' }
        });
        const res = httpMocks.createResponse();
        res.send = jest.fn();

        Review.create.mockRejectedValue(new Error('Database error'));

        await ReviewController.createReview(req, res);

        expect(Review.create).toHaveBeenCalledWith({
          userId: 1,
          tripId: 1, 
          rating: 5, 
          comment: 'Great experience'
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

        await ReviewController.createReview(req, res);

        expect(res.statusCode).toBe(400);
        expect(res.send).toHaveBeenCalledWith({ message: 'Missing data to create review.' });
      });
  });

  describe('updateReview', () => {
    it('should update a review', async () => {
      const req = httpMocks.createRequest({
        params: { reviewId: 1 },
        userId: 1,
        body: { rating: 4, comment: 'Updated comment' },
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockReview = {
        userId: 1,
        tripId: 1,
      };

      Review.findByPk.mockResolvedValue(mockReview);
      jest.spyOn(Review, 'update').mockResolvedValue([1]);



      await ReviewController.updateReview(req, res);

      expect(Review.findByPk).toHaveBeenCalledWith(1);
      expect(Review.update).toHaveBeenCalledWith({ rating: 4, comment: 'Updated comment' }, { where: { reviewId: 1 } });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Review was updated successfully.' });
    });


    it('should return 404 if Review is not found', async () => {
        const req = httpMocks.createRequest({
          params: { reviewId: 1 },
          userId: 1,
          body: { rating: 4, comment: 'Updated comment' },
        });
        const res = httpMocks.createResponse();
        res.send = jest.fn();

        Review.findByPk.mockResolvedValue(null);

        await ReviewController.updateReview(req, res);

        expect(Review.findByPk).toHaveBeenCalledWith(1);
        expect(res.statusCode).toBe(404);
        expect(res.send).toHaveBeenCalledWith({ message: 'Cannot find review with id=1' });
      });

      it('should return 403 if user is not authorized', async () => {
        const req = httpMocks.createRequest({
          params: { reviewId: 1 },
          userId: 2,
          body: { rating: 4, comment: 'Updated comment' },
        });
        const res = httpMocks.createResponse();
        res.send = jest.fn();

        const mockReview = {
          userId: 1,
          tripId: 1
        };

        Review.findByPk.mockResolvedValue(mockReview);

        await ReviewController.updateReview(req, res);

        expect(Review.findByPk).toHaveBeenCalledWith(1);
        expect(res.statusCode).toBe(403);
        expect(res.send).toHaveBeenCalledWith({ message: 'You are not authorized to update this review.' });
      });

      it('should handle errors', async () => {
        const req = httpMocks.createRequest({
          params: { reviewId: 1 },
          userId: 1,
          body: { rating: 4, comment: 'Updated comment' },
        });
        const res = httpMocks.createResponse();
        res.send = jest.fn();

        Review.findByPk.mockRejectedValue(new Error('Database error'));

        await ReviewController.updateReview(req, res);

        expect(Review.findByPk).toHaveBeenCalledWith(1);
        expect(res.statusCode).toBe(500);
        expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
      });
  });

  describe('deleteReview', () => {
    it('should delete a review', async () => {
      const req = httpMocks.createRequest({
        params: { reviewId: 1 },
        userId: 1
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      const mockReview = {
        userId: 1,
        tripId: 1
      };

      Review.findByPk.mockResolvedValue(mockReview);
      Review.destroy.mockResolvedValue(1);

      await ReviewController.deleteReview(req, res);

      expect(Review.findByPk).toHaveBeenCalledWith(1);
      expect(Review.destroy).toHaveBeenCalledWith({ where: { reviewId: 1 } });
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ message: 'Review was deleted successfully!' });
    });

    it('should return 404 if review is not found', async () => {
        const req = httpMocks.createRequest({
          params: { reviewId: 1 },
          userId: 1
        });
        const res = httpMocks.createResponse();
        res.send = jest.fn();

        Review.findByPk.mockResolvedValue(null);

        await ReviewController.deleteReview(req, res);

        expect(Review.findByPk).toHaveBeenCalledWith(1);
        expect(res.statusCode).toBe(404);
        expect(res.send).toHaveBeenCalledWith({ message: 'Cannot find Review with id=1' });
      });

      it('should return 403 if user is not authorized', async () => {
        const req = httpMocks.createRequest({
          params: { reviewId: 1 },
          userId: 2
        });
        const res = httpMocks.createResponse();
        res.send = jest.fn();

        const mockReview = {
          userId: 1
        };

        Review.findByPk.mockResolvedValue(mockReview);

        await ReviewController.deleteReview(req, res);

        expect(Review.findByPk).toHaveBeenCalledWith(1);
        expect(res.statusCode).toBe(403);
        expect(res.send).toHaveBeenCalledWith({ message: 'You are not authorized to delete this review.' });
      });

      it('should handle errors', async () => {
        const req = httpMocks.createRequest({
          params: { reviewId: 1 },
          userId: 1
        });
        const res = httpMocks.createResponse();
        res.send = jest.fn();

        Review.findByPk.mockRejectedValue(new Error('Database error'));

        await ReviewController.deleteReview(req, res);

        expect(Review.findByPk).toHaveBeenCalledWith(1);
        expect(res.statusCode).toBe(500);
        expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
      });
  });

  describe('getReviewById', () => {
    it('should get a review by ID', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Review.findByPk.mockResolvedValue({ reviewId: 1 });

      await ReviewController.getReviewById(req, res);

      expect(Review.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(200);
      expect(res.send).toHaveBeenCalledWith({ reviewId: 1 });
    });

    it('should return 404 if review is not found', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Review.findByPk.mockResolvedValue(null);

      await ReviewController.getReviewById(req, res);

      expect(Review.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(404);
      expect(res.send).toHaveBeenCalledWith({ message: 'Review Not found.' });
    });

    it('should handle errors', async () => {
      const req = httpMocks.createRequest({
        params: { id: 1 }
      });
      const res = httpMocks.createResponse();
      res.send = jest.fn();

      Review.findByPk.mockRejectedValue(new Error('Database error'));

      await ReviewController.getReviewById(req, res);

      expect(Review.findByPk).toHaveBeenCalledWith(1);
      expect(res.statusCode).toBe(500);
      expect(res.send).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });

});