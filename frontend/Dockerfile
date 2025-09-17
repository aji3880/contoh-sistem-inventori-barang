FROM node:18-alpine AS build

WORKDIR /app

RUN test -f package.json || cat > package.json <<'EOF'
{
  "name": "frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
EOF

COPY . .
RUN npm install
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "preview"]
