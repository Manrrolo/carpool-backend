const db = require('../models');
const Review = db.review;

// GET ALL reviews of a user
exports.getAllReviewsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reviews = await Review.findAll({ where: { userId: userId } });
        res.status(200).send(reviews);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// GET ALL reviews of a trip
exports.getAllReviewsByTrip = async (req, res) => {
    try {
        const tripId = req.params.tripId;
        const reviews = await Review.findAll({ where: { tripId: tripId } });
        res.status(200).send(reviews);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Create New review
exports.createReview = async (req, res) => {
    try {
        const userId = req.userId;
        const { tripId, rating, comment } = req.body;

        if (!userId || !tripId || !rating || !comment) {
            return res.status(400).send({ message: "Missing data to create review." });
        }

        const review = await Review.create({ userId, tripId, rating, comment });
        res.status(201).send(review);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Update review
exports.updateReview = async (req, res) => {
    const reviewId = req.params.reviewId;
    const userId = req.userId;
    const { rating, comment } = req.body;

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).send({ message: `Cannot find review with id=${reviewId}` });
        }

        // Check driver
        if (review.userId !== userId) {
            return res.status(403).send({ message: `You are not authorized to update this review.` });
        }

        // Update review
        const [numUpdated] = await Review.update(
            { rating, comment },
            { where: { reviewId: reviewId } }
        );

        if (numUpdated === 1) {
            res.status(200).send({ message: 'Review was updated successfully.' });
        } else {
            res.status(404).send({ message: `Cannot update Review with id=${reviewId}. Maybe Review was not found or req.body is empty!` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

// Delete review
exports.deleteReview = async (req, res) => {
    const reviewId = req.params.reviewId;
    const userId = req.userId;

    try {
        const review = await Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).send({ message: `Cannot find Review with id=${reviewId}` });
        }

        // Check driver authorization
        if (review.userId !== userId) {
            return res.status(403).send({ message: `You are not authorized to delete this review.` });
        }

        const numDeleted = await Review.destroy({
            where: { reviewId: reviewId }
        });

        if (numDeleted === 1) {
            res.status(200).send({ message: "Review was deleted successfully!" });
        } else {
            res.status(404).send({ message: `Cannot delete Review with id=${reviewId}. Maybe Review was not found.` });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

exports.getReviewById = async (req, res) => {
    try {
        const id = req.params.id;
        const review = await Review.findByPk(id);
        if (!review) {
            return res.status(404).send({ message: 'Review Not found.' });
        }
        res.status(200).send(review);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};