const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const app = express();
const port = 8080;

// Function to mask sensitive data
const maskSensitiveData = (str) => {
  if (str && str.length > 4) {
    return '*'.repeat(str.length - 4) + str.slice(-4);
  }
  return str;
};

// Create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

// Custom logging middleware
app.use((req, res, next) => {
  const log = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
  accessLogStream.write(log);
  next();
});

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve favicon
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'favicon.ico'));
});

// Serve configuration
app.get('/config', (req, res) => {
  const config = {
    REACT_APP_XATA_API_KEY: process.env.REACT_APP_XATA_API_KEY,
    REACT_APP_XATA_DATABASE_URL: process.env.REACT_APP_XATA_DATABASE_URL
  };
  console.log('Sending config:', JSON.stringify({
    REACT_APP_XATA_API_KEY: maskSensitiveData(config.REACT_APP_XATA_API_KEY),
    REACT_APP_XATA_DATABASE_URL: maskSensitiveData(config.REACT_APP_XATA_DATABASE_URL)
  }));
  res.json(config);
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.use((req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');
  next();
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
  console.log('Environment variables:');
  console.log(`REACT_APP_XATA_API_KEY: ${maskSensitiveData(process.env.REACT_APP_XATA_API_KEY)}`);
  console.log(`REACT_APP_XATA_DATABASE_URL: ${maskSensitiveData(process.env.REACT_APP_XATA_DATABASE_URL)}`);
});