// Example using Sequelize for MySQL
const { Sequelize } = require('sequelize');

// Replace placeholders with your MySQL credentials
const sequelize = new Sequelize('<DB_NAME>', '<DB_USER>', '<DB_PASSWORD>', {
  host: '<DB_HOST>',
  dialect: 'mysql',
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connection established successfully.');
    // Synchronize models (creates tables if they don't exist)
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
