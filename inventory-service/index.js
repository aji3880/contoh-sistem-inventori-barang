// inventory-service/index.js
const express = require('express');
const amqp = require('amqplib');
const app = express();
app.use(express.json());

let products = [
{ id: 1, sku: 'P001', name: 'Produk A', stock: 10 }
];
let idSeq = 2;

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

function publishEvent(event) {
if(!channel) return console.warn('No MQ channel');
channel.publish('inventory_events', '', Buffer.from(JSON.stringify(event)));
}

app.get('/', (req, res) => res.json(products));
app.post('/', (req, res) => {
const { sku, name, stock } = req.body;
const p = { id: idSeq++, sku, name, stock: Number(stock||0) };
products.push(p);
res.status(201).json(p);
});

// Update stock (example operation)
app.post('/:id/adjust', (req, res) => {
const id = Number(req.params.id);
const { delta } = req.body; // positive or negative
const prod = products.find(x => x.id === id);
if(!prod) return res.status(404).json({ error: 'not found' });
prod.stock += Number(delta);
// publish event
publishEvent({ type: 'stock.updated', productId: prod.id, sku: prod.sku, stock: prod.stock, timestamp: new Date().toISOString() });
res.json(prod);
});

app.listen(3002, () => console.log('Inventory service on :3002'));