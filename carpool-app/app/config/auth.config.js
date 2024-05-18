const process = require('process');

module.exports = {
  secret: process.env.JWT_SECRET,
};
