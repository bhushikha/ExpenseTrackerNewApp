
const Sequelize= require('sequelize');

// Create a Sequelize instance
const sequelize = new Sequelize('bookingapp', 'root', 'Mishra21@', {
    host: 'localhost',
    dialect: 'mysql',
  });

  module.exports= sequelize;