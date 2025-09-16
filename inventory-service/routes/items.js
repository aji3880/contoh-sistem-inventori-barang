const express = require('express');
module.exports = (Item) => {
  const r = express.Router();

  // basic authentication middleware: expects Authorization: Bearer <token>
  // for simplicity, we just forward token to user-service would validate in real world
  r.use((req,res,next)=>{
    const auth = req.headers['authorization'];
    if(!auth) return res.status(401).json({error:'no token'});
    // In production, validate token or call user-service introspect
    next();
  });

  // list items
  r.get('/', async (req,res)=>{
    try {
      const items = await Item.findAll();
      res.json(items);
    } catch(err) {
      res.status(500).json({error: err.message});
    }
  });

  // create new item
  r.post('/', async (req,res)=>{
    try{
      const it = await Item.create(req.body);
      res.json(it);
    }catch(err){
      res.status(400).json({error: err.message});
    }
  });

  // get single item by id
  r.get('/:id', async (req,res)=>{
    try {
      const it = await Item.findByPk(req.params.id);
      if(!it) return res.status(404).json({error:'not found'});
      res.json(it);
    } catch(err) {
      res.status(500).json({error: err.message});
    }
  });

  // update item fields
  r.put('/:id', async (req,res)=>{
    try {
      const it = await Item.findByPk(req.params.id);
      if(!it) return res.status(404).json({error:'not found'});
      await it.update(req.body);
      res.json(it);
    } catch(err) {
      res.status(400).json({error: err.message});
    }
  });

  // adjust stock by delta: { "delta": -1 }
  r.put('/:id/adjust', async (req,res)=>{
    const id = req.params.id;
    const { delta } = req.body;
    if(typeof delta !== 'number') return res.status(400).json({error:'delta harus number'});
    try {
      const it = await Item.findByPk(id);
      if(!it) return res.status(404).json({error:'not found'});
      it.stock = it.stock + delta;
      await it.save();
      res.json(it);
    } catch(err) {
      res.status(500).json({error: err.message});
    }
  });

  // delete item
  r.delete('/:id', async (req,res)=>{
    try {
      const it = await Item.findByPk(req.params.id);
      if(!it) return res.status(404).json({error:'not found'});
      await it.destroy();
      res.json({message:'deleted'});
    } catch(err) {
      res.status(500).json({error: err.message});
    }
  });

  return r;
}