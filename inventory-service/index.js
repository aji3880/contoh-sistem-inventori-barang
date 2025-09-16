const express = require('express');
const amqp = require('amqplib');
const { Product, initDb } = require('./models');

const app = express();
app.use(express.json());

let channel = null;
async function connectMQ() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672');
    channel = await conn.createChannel();
    await channel.assertExchange('inventory_events', 'fanout', { durable: false });
    console.log('Inventory service connected to RabbitMQ');
  } catch (err) {
    console.error('Failed to connect to RabbitMQ', err.message);
  }
}

connectMQ();
initDb();

function publishEvent(event) {
  if(!channel) return;
  channel.publish('inventory_events', '', Buffer.from(JSON.stringify(event)));
}

app.get('/', async (req, res) => res.json(await Product.findAll()));

app.post('/', async (req, res) => {
  const { sku, name, stock } = req.body;
  const p = await Product.create({ sku, name, stock });
  res.status(201).json(p);
});

app.post('/:id/adjust', async (req, res) => {
  const prod = await Product.findByPk(req.params.id);
  if(!prod) return res.status(404).json({ error: 'not found' });
  prod.stock += Number(req.body.delta);
  await prod.save();
  publishEvent({ type: 'stock.updated', productId: prod.id, sku: prod.sku, stock: prod.stock, timestamp: new Date().toISOString() });
  res.json(prod);
});

app.listen(3002, () => console.log('Inventory service on :3002'));