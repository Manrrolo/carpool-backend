const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models');
const User = db.user;

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token.split(' ')[1], config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === 'admin') {
      next();
      return;
    }
    res.status(403).send({
      message: 'Require Admin Role!',
    });
  });
};

const isDriver = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === 'driver') {
      next();
      return;
    }
    res.status(403).send({
      message: 'Require Driver Role!',
    });
  });
};

const isPassenger = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user.role === 'passenger') {
      next();
      return;
    }
    res.status(403).send({
      message: 'Require Passenger Role!',
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isDriver,
  isPassenger,
};
module.exports = authJwt;
