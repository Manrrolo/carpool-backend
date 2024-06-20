module.exports = (sequelize, Sequelize) => {
  const Publication = sequelize.define('publications', {
    publicationId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    driverId: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'userId',
      },
    },
    origin: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    destination: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    availableSeats: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    cost: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
  });

  return Publication;
};
