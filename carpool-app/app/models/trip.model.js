module.exports = (sequelize, Sequelize) => {
    const Trip = sequelize.define('trips', {
        tripId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        publicationId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'publications',
                key: 'publicationId'
            }
        },
        driverId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'userId',
            }
        },
        departureDateTime: {
            type: Sequelize.DATE,
        },
        arrivalDateTime: {
            type: Sequelize.DATE,
        },
        status: {
            type: Sequelize.STRING,
        },
    });

    return Trip;
};