const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const UserModel = require('./models/user');
const authRoutes = require('./routes/auth');

const PORT = process.env.PORT || 3001;
const DB_HOST = process.env.DB_HOST || 'localhost';

const sequelize = new Sequelize(process.env.DB_NAME || 'userdb', process.env.DB_USER || 'user', process.env.DB_PASS || 'userpass', {
  host: DB_HOST,
  dialect: 'postgres',
  logging: false,
});

const app = express();
app.use(bodyParser.json());

const User = UserModel(sequelize);

app.use('/auth', authRoutes(User));

app.get('/health', (req,res)=> res.json({ok:true}));

async function init(){
  await sequelize.sync();
  app.listen(PORT, ()=> console.log(`User service on ${PORT}`));
}

init();