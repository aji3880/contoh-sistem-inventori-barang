const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Item = sequelize.define('Item', {
    id: { type: DataTypes.INTEGER, primaryKey:true, autoIncrement:true },
    sku: { type: DataTypes.STRING, unique:true },
    name: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    stock: { type: DataTypes.INTEGER, defaultValue:0 },
    min_stock: { type: DataTypes.INTEGER, defaultValue:0 }
  }, { tableName: 'items', timestamps: true });
  return Item;
}