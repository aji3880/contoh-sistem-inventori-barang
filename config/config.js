module.exports = {
  development: {
    url: process.env.DB_URI,
    dialect: 'postgres'
  },
  test: {
    url: process.env.DB_URI,
    dialect: 'postgres'
  },
  production: {
    url: process.env.DB_URI,
    dialect: 'postgres'
  }
};