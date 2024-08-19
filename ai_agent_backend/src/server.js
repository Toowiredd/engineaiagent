const express = require('express');
const cors = require('cors');
const axios = require('axios');
const config = require('../config/config');
const neo4j = require('./neo4jDriver');

const app = express();

app.use(cors());
app.use(express.json());

const xataAxios = axios.create({
  baseURL: config.databaseUrl,
  headers: {
    'Authorization': `Bearer ${config.xataApiKey}`,
    'Content-Type': 'application/json'
  }
});

// ... (keep all previous endpoints) ...

// Xata: Store a new conversation message with branch information
app.post('/api/messages', async (req, res) => {
  try {
    const { userId, agentId, content, parentMessageId, branchName } = req.body;
    if (!userId || !agentId || !content) {
      return res.status(400).json({ error: 'userId, agentId, and content are required' });
    }
    const response = await xataAxios.post('/tables/messages/data', {
      user_id: userId,
      agent_id: agentId,
      content,
      parent_message_id: parentMessageId || null,
      branch_name: branchName || 'main',
      timestamp: new Date().toISOString()
    });
    res.status(201).json(response.data);
  } catch (error) {
    console.error(`Error storing message: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Xata: Get conversation messages for a specific branch
app.get('/api/messages/:userId/:branchName', async (req, res) => {
  try {
    const { userId, branchName } = req.params;
    const response = await xataAxios.post('/tables/messages/query', {
      filter: { 
        user_id: userId,
        branch_name: branchName
      },
      sort: { timestamp: 'asc' },
      page: { size: 100 }
    });
    res.json({
      messages: response.data.records,
      meta: response.data.meta
    });
  } catch (error) {
    console.error(`Error fetching messages: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Neo4J: Create a new conversation branch
app.post('/api/branches', async (req, res) => {
  const session = neo4j.driver.session();
  try {
    const { userId, parentMessageId, newBranchName } = req.body;
    const result = await session.run(
      'MATCH (u:User {id: $userId})-[:HAS_MESSAGE]->(m:Message {id: $parentMessageId}) ' +
      'CREATE (m)-[:BRANCHES_TO]->(newBranch:Branch {name: $newBranchName}) ' +
      'RETURN newBranch',
      { userId, parentMessageId, newBranchName }
    );
    res.status(201).json({ message: 'Branch created', data: result.records[0].get('newBranch').properties });
  } catch (error) {
    console.error(`Error creating branch: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  } finally {
    await session.close();
  }
});

// Neo4J: Get conversation branch structure
app.get('/api/branches/:userId', async (req, res) => {
  const session = neo4j.driver.session();
  try {
    const { userId } = req.params;
    const result = await session.run(
      'MATCH (u:User {id: $userId})-[:HAS_MESSAGE]->(m:Message) ' +
      'OPTIONAL MATCH (m)-[:BRANCHES_TO]->(b:Branch) ' +
      'RETURN m.id AS messageId, m.content AS messageContent, ' +
      'collect(b.name) AS branches ' +
      'ORDER BY m.timestamp',
      { userId }
    );
    const branchStructure = result.records.map(record => ({
      messageId: record.get('messageId'),
      messageContent: record.get('messageContent'),
      branches: record.get('branches')
    }));
    res.json({ branchStructure });
  } catch (error) {
    console.error(`Error fetching branch structure: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  } finally {
    await session.close();
  }
});

app.listen(config.port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${config.port}`);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await neo4j.close();
  process.exit(0);
});