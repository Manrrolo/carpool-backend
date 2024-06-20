const db = require('../models');
const Review = db.review;
const User = db.user;


exports.allAccess = (req, res) => {
  res.status(200).send('Public Content.');
};
exports.userBoard = (req, res) => {
  res.status(200).send('User Content.');
};
exports.adminBoard = (req, res) => {
  res.status(200).send('Admin Content.');
};
exports.moderatorBoard = (req, res) => {
  res.status(200).send('Moderator Content.');
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    const reviews = await Review.findAll({
      where: { userId: userId },
    });

    const user = await User.findAll({
      where: { userId: userId },
    });

    res.status(200).send({
      reviews,
      //decoded: req.decoded,
      user
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }

};
