module.exports = (sequelize, DataTypes) => (
    sequelize.define('vote', {
        target: {
            type: DataTypes.ENUM('left', 'right'),
        },
    }, {
        timestamps: true,
    })
);