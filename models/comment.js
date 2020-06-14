module.exports = (sequelize, DataTypes) => (
    sequelize.define('comment', {
        content: {
            type: DataTypes.STRING(500),
            allowNull: false,
        },
        like: {
            type: DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0,
        },
    }, {
        timestamps: true,
        paranoid: true,
    })
);