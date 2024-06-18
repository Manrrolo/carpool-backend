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
      type: Sequelize.STRING,
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
      type: Sequelize.STRING,
    },
  });

  return Request;
};
