const { publication } = require(".");

module.exports = (sequelize, Sequelize) => {
  const Request = sequelize.define('requests', {
    requestId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    publicationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'publications',
        key: 'publicationId',
      },
    },
    passengerId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId',
      },
    },
    reservationDate: {
      type: Sequelize.DATETIME,
    },
    status: {
      type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
    },
  });

  return Request;
};