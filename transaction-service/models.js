const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URI || 'postgres://user:pass@transaction-db:5432/transactiondb');

const Transaction = sequelize.define('Transaction', {
  type: { type: DataTypes.STRING },
  payload: { type: DataTypes.JSON },
  ts: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { timestamps: false });

async function initDb() {
  await sequelize.sync();
  console.log('Transaction DB ready');
}

module.exports = { Transaction, initDb };