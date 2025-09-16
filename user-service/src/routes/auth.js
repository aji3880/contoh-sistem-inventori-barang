const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = (User) => {
  const router = express.Router();
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';

  router.post('/register', async (req,res)=>{
    const { username, email, password, role } = req.body;
    if(!username||!email||!password) return res.status(400).json({error:'missing fields'});
    try{
      const user = await User.create({ username, email, password, role });
      return res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
    }catch(err){
      return res.status(400).json({ error: err.message });
    }
  });

  router.post('/login', async (req,res)=>{
    const { username, password } = req.body;
    if(!username||!password) return res.status(400).json({error:'missing fields'});
    const user = await User.findOne({ where: { username } });
    if(!user) return res.status(401).json({error:'invalid credentials'});
    const ok = await user.validatePassword(password);
    if(!ok) return res.status(401).json({error:'invalid credentials'});
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  });

  return router;
}