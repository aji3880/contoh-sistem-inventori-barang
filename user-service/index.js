/ user-service/index.js
const express = require('express');
const app = express();
app.use(express.json());

let users = [
{ id: 1, username: 'admin', email: 'admin@example.com', role: 'admin', created_at: new Date().toISOString() }
];
let idSeq = users.length + 1;

app.get('/', (req, res) => res.json(users));
app.get('/:id', (req, res) => {
const u = users.find(x => x.id === Number(req.params.id));
if(!u) return res.status(404).json({error: 'not found'});
res.json(u);
});

app.post('/', (req, res) => {
const { username, email, role } = req.body;
const newUser = { id: idSeq++, username, email, role, created_at: new Date().toISOString() };
users.push(newUser);
res.status(201).json(newUser);
});

app.listen(3001, () => console.log('User service on :3001'));