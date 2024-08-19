require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8080,
  xataApiKey: process.env.XATA_API_KEY,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
  neo4j: {
    uri: process.env.NEO4J_URI,
    user: process.env.NEO4J_USER,
    password: process.env.NEO4J_PASSWORD
  }
};