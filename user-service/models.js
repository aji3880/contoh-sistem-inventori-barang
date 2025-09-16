const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_URI || 'postgres://user:pass@user-db:5432/userdb');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { timestamps: false });

async function initDb() {
  await sequelize.sync();
  console.log('User DB ready');
}

module.exports = { User, initDb };