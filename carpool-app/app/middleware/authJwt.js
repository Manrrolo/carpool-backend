const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const db = require('../models');
const User = db.user;
require('dotenv').config();

const client = jwksClient({
  jwksUri: process.env.AUTH0_JWKS_URI,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      return callback(err);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  token = token.split(' ')[1];

  jwt.verify(token, getKey, (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.sub;
    req.decoded = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    if (user && user.role === 'admin') {
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
    if (user && user.role === 'driver') {
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
    if (user && user.role === 'passenger') {
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
