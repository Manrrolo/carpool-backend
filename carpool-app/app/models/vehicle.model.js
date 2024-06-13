module.exports = (sequelize, Sequelize) => {
    const Vehicle = sequelize.define('vehicles', {
        vehicleId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            },
        },
        brand: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        model: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        licensePlate: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
    });

    return Vehicle;
};