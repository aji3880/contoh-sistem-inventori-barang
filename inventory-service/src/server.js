const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const ItemModel = require('./models/item');
const itemsRouter = require('./routes/items');

const PORT = process.env.PORT || 3002;
const sequelize = new Sequelize(process.env.DB_NAME||'inventorydb', process.env.DB_USER||'inv', process.env.DB_PASS||'invpass', {
  host: process.env.DB_HOST || 'localhost', dialect: 'postgres', logging:false
});

const app = express();
app.use(bodyParser.json());

const Item = ItemModel(sequelize);
app.use('/items', itemsRouter(Item));

app.get('/health',(req,res)=> res.json({ok:true}));

async function init(){
  await sequelize.sync();
  app.listen(PORT, ()=> console.log(`Inventory service on ${PORT}`));
}

init();