FROM node:18-alpine
WORKDIR /app

RUN test -f package.json || cat > package.json <<'EOF'
{
  "name": "transaction-service",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

RUN npm install

COPY . .

CMD ["node", "index.js"]
