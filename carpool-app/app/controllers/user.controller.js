const db = require('../models');
const Review = db.review;
const User = db.user;
const { Op } = require('sequelize');

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Buscar el usuario por userId
    const user = await User.findOne({
      where: { userId: userId },
    });

    // Si el usuario no existe, devolver error 404
    if (!user) {
      return res.status(404).send({ message: `User with userId ${userId} not found.` });
    }

    // Buscar los reviews del usuario
    const reviews = await Review.findAll({
      where: { userId: userId },
    });

    let averageRating = null;
    // Calcular el rating promedio si el usuario tiene reviews
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      averageRating = totalRating / reviews.length;
    }

    res.status(200).send({
      reviews,
      averageRating,
      user
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};


exports.changeRole = async (req, res) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({
      where: { email: email },
    });

    // If user does not exist, return 404
    if (!user) {
      return res.status(404).send({ message: `User with email ${email} not found.` });
    }

    // Update the user's role to 'driver'
    user.role = 'driver';
    await user.save();

    res.status(200).send({ message: `User role updated to driver.` });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
