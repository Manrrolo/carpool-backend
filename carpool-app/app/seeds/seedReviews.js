const db = require('../models');

const Review = db.review;

async function seedReviews() {
  try {
    await Review.create({
      userId: 'auth0|6671d0d41b6ba4f5d852d017',
      tripId: 1,
      rating: 5,
      comment: 'Excellent trip! Very comfortable and safe.',
      reviewDate: new Date(Date.now()),
    });

    await Review.create({
      userId: 'auth0|667209355ff76c5f6ecc52c0',
      tripId: 2,
      rating: 4,
      comment: 'Great trip, but the car was a bit late.',
      reviewDate: new Date(Date.now()),
    });

    await Review.create({
      userId: 'auth0|6672097fdff67714af259298',
      tripId: 3,
      rating: 3,
      comment: 'Average trip, not very clean.',
      reviewDate: new Date(Date.now()),
    });
  } catch (error) {
    console.error('Error seeding reviews:', error);
  }
}

module.exports = seedReviews;
