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
db.vehicle = require('./vehicle.model')(sequelize, Sequelize);
db.trip = require('./trip.model')(sequelize, Sequelize);

// Define relationships
db.user.belongsToMany(db.role, {
  through: 'user_roles',
  as: 'roles',
  foreignKey: 'userId',
});
db.role.belongsToMany(db.user, {
  through: 'user_roles',
  as: 'users',
  foreignKey: 'roleId',
});
db.publication.belongsTo(db.user, {
  foreignKey: 'driverId',
  as: 'driver',
});
db.user.hasMany(db.publication, {
  foreignKey: 'driverId',
  as: 'publications',
});
db.user.hasMany(db.vehicle, {
  foreignKey: 'userId',
  as: 'vehicles',
});
db.vehicle.belongsTo(db.user, {
  foreignKey: 'userId',
  as: 'driver',
});
db.request.belongsTo(db.publication, {
  foreignKey: 'publicationId',
  as: 'publication',
});
db.publication.hasMany(db.request, {
  foreignKey: 'publicationId',
  as: 'requests',
});
db.request.belongsTo(db.user, {
  foreignKey: 'passengerId',
  as: 'passenger',
});
db.user.hasMany(db.request, {
  foreignKey: 'passengerId',
  as: 'requests',
});
db.user.hasMany(db.trip, {
  foreignKey: 'driverId',
  as: 'trips',
});
db.trip.belongsTo(db.user, {
  foreignKey: 'driverId',
  as: 'driver',
});
db.publication.hasOne(db.trip, {
  foreignKey: 'publicationId',
  as: 'trip',
});
db.trip.belongsTo(db.publication, {
  foreignKey: 'publicationId',
  as: 'publication',
});

db.ROLES = ['user', 'admin', 'moderator'];

module.exports = db;
