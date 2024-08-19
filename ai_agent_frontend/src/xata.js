import { buildClient } from '@xata.io/client';

// TODO: Replace with your own database URL and API key
const databaseURL = process.env.REACT_APP_XATA_DATABASE_URL;
const apiKey = process.env.REACT_APP_XATA_API_KEY;

export const getXataClient = () => {
  if (!databaseURL || !apiKey) {
    throw new Error('Missing Xata database URL or API key');
  }
  
  return buildClient({
    databaseURL,
    apiKey,
    branch: process.env.REACT_APP_XATA_BRANCH || 'main',
  });
};