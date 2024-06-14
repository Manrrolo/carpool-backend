<<<<<<< HEAD
const { publication } = require(".");

=======
>>>>>>> a92043241937000d594d9b273edd704d57e4881a
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
      type: Sequelize.DATE,
    },
    status: {
<<<<<<< HEAD
      type: Sequelize.ENUM('pending', 'accepted', 'rejected'),
=======
      type: Sequelize.STRING,
>>>>>>> a92043241937000d594d9b273edd704d57e4881a
    },
  });

  return Request;
};