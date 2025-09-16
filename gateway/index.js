// gateway/index.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(express.json());

// Konfigurasi proxy ke service
app.use('/api/users', createProxyMiddleware({ target: 'http://user-service:3001', changeOrigin: true, pathRewrite: {'^/api/users': ''} }));
app.use('/api/inventory', createProxyMiddleware({ target: 'http://inventory-service:3002', changeOrigin: true, pathRewrite: {'^/api/inventory': ''} }));
app.use('/api/transactions', createProxyMiddleware({ target: 'http://transaction-service:3003', changeOrigin: true, pathRewrite: {'^/api/transactions': ''} }));
s
app.listen(3000, () => console.log('API Gateway listening on :3000'));