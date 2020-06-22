module.exports = (sequelize, DataTypes) => (
    sequelize.define('report', {
        content: {
            type: DataTypes.STRING(80),
            allowNull: true,
        },
    }, {
        timestamps: true,
    })
);