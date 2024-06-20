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
    console.log('Decoded JWT:', decoded);
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

const checkRole = (role) => {
  return (req, res, next) => {
    User.findByPk(req.userId, {
      include: [
        {
          model: db.role,
          as: 'roles',
        },
      ],
    })
      .then((user) => {
        if (!user) {
          res.status(404).send({
            message: 'User not found!',
          });
          return;
        }

        const roles = user.roles.map((role) => role.name);

        if (roles.includes(role)) {
          next();
          return;
        }

        res.status(403).send({
          message: `Require ${role} Role!`,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  };
};

const isDriver = checkRole('driver');
const isPassenger = checkRole('passenger');

const authJwt = {
  verifyToken,
  isAdmin,
  isDriver,
  isPassenger,
};

module.exports = authJwt;
