module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    userId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    lastName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
      references: {
        model: 'roles',
        key: 'name',
      },
    },
    inTrip: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },

    driversLicence: {
      type: Sequelize.STRING,
      defaultValue: null, // Ensure the default value is null

    },
  });

  return User;
};
