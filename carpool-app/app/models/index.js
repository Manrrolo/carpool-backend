const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.port,
  logging: false,
  pool: {
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize, Sequelize);
db.role = require('./role.model')(sequelize, Sequelize);
db.publication = require('./publication.model')(sequelize, Sequelize);
db.request = require('./request.model')(sequelize, Sequelize);
<<<<<<< HEAD
db.vehicle = require('./vehicle.model')(sequelize, Sequelize);
=======
>>>>>>> a92043241937000d594d9b273edd704d57e4881a

// Define relationships
db.role.belongsToMany(db.user, {
  through: 'user_roles',
});
db.user.belongsToMany(db.role, {
  through: 'user_roles',
});
db.publication.belongsTo(db.user, {
  foreignKey: 'driverId',
  as: 'driver',
});
db.user.hasMany(db.publication, {
  foreignKey: 'driverId',
  as: 'publications',
});
<<<<<<< HEAD
db.user.hasMany(db.vehicle, {
  foreignKey: 'userId',
  as: 'vehicles'
});
=======
>>>>>>> a92043241937000d594d9b273edd704d57e4881a
db.request.belongsTo(db.publication, {
  foreignKey: 'publicationId',
  as: 'publication',
});
db.publication.hasMany(db.request, {
  foreignKey: 'publicationId',
  as: 'requests',
});
<<<<<<< HEAD
=======
db.request.belongsTo(db.user, {
  foreignKey: 'passengerId',
  as: 'passenger',
});
db.user.hasMany(db.request, {
  foreignKey: 'passengerId',
  as: 'requests',
});
>>>>>>> a92043241937000d594d9b273edd704d57e4881a

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;
