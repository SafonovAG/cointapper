const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
);

const User = sequelize.define('User', {
    telegramId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    photoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    coins: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    referrerId: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

sequelize.sync();

module.exports = User;
