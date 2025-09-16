// simple gateway for routing
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

const USER_SERVICE = process.env.USER_SERVICE_URL || 'http://localhost:3001';
const INV_SERVICE = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3002';
const TX_SERVICE = process.env.TRANSACTION_SERVICE_URL || 'http://localhost:3003';

app.use('/auth', createProxyMiddleware({ target: USER_SERVICE, changeOrigin: true }));
app.use('/users', createProxyMiddleware({ target: USER_SERVICE, changeOrigin: true }));
app.use('/items', createProxyMiddleware({ target: INV_SERVICE, changeOrigin: true }));
app.use('/transactions', createProxyMiddleware({ target: TX_SERVICE, changeOrigin: true }));

app.get('/', (req,res)=> res.send('API Gateway up'));

app.listen(PORT, ()=> console.log(`API Gateway listening on ${PORT}`));