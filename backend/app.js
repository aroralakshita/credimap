const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors({
  origin: ["https://credimap-mu.vercel.app"], // your Vercel URL
  credentials: true, // if you use cookies
}));

app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orgs', require('./routes/orgs'));
app.use('/api/reviews', require('./routes/review'));

module.exports = app;
