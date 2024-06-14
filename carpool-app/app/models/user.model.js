module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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
    password: {
      type: Sequelize.STRING,
    },
    verified: {
      type: Sequelize.BOOLEAN,
    },
    phone: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
    }
  });

  return User;
};
