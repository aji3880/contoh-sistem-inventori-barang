const express = require('express');
const amqp = require('amqplib');
const { Transaction, initDb } = require('./models');

const app = express();
app.use(express.json());

initDb();

async function connectMQ() {
  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://rabbitmq:5672');
    const channel = await conn.createChannel();
    const q = await channel.assertQueue('', { exclusive: true });
    await channel.bindQueue(q.queue, 'inventory_events', '');
    channel.consume(q.queue, async msg => {
      if(msg) {
        const ev = JSON.parse(msg.content.toString());
        console.log('Received event', ev);
        await Transaction.create({ type: ev.type, payload: ev });
      }
    }, { noAck: true });
    console.log('Transaction service connected to RabbitMQ');
  } catch (err) {
    console.error('MQ connect failed', err.message);
  }
}
connectMQ();

app.get('/', async (req, res) => res.json(await Transaction.findAll()));

app.listen(3003, () => console.log('Transaction service on :3003'));