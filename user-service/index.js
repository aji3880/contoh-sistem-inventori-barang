const express = require('express');
const { User, initDb } = require('./models');

const app = express();
app.use(express.json());

initDb();

app.get('/', async (req, res) => res.json(await User.findAll()));

app.get('/:id', async (req, res) => {
  const u = await User.findByPk(req.params.id);
  if(!u) return res.status(404).json({error: 'not found'});
  res.json(u);
});

app.post('/', async (req, res) => {
  const { username, email, role } = req.body;
  const newUser = await User.create({ username, email, role });
  res.status(201).json(newUser);
});

app.listen(3001, () => console.log('User service on :3001'));