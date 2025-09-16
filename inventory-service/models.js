const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URI || 'postgres://user:pass@inventory-db:5432/inventorydb');

const Product = sequelize.define('Product', {
  sku: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { timestamps: false });

async function initDb() {
  await sequelize.sync();
  console.log('Inventory DB ready');
}

module.exports = { Product, initDb };