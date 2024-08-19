require('dotenv').config();
const { buildClient } = require('@xata.io/client');

const xata = buildClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.DATABASE_URL, // Example: "https://yourworkspace-1234.xata.sh/db/main"
});

async function testConnection() {
  try {
    const result = await xata.tables.list();
    console.log('Connection successful. Tables:', result);
  } catch (error) {
    console.error('Connection failed:', error);
  }
}

testConnection();