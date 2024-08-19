require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const { buildClient } = require('@xata.io/client');

// Initialize Xata client
const xata = buildClient({
  apiKey: process.env.XATA_API_KEY,
  databaseURL: process.env.DATABASE_URL,
});

async function fetchData(url) {
  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const resources = [];
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      const text = $(element).text();
      if (href && text) {
        resources.push({ href, text });
      }
    });

    return resources;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

async function storeResources(resources) {
  try {
    for (const resource of resources) {
      await xata.db.resources.create({
        href: resource.href,
        text: resource.text,
      });
    }
    console.log('Resources stored successfully!');
  } catch (error) {
    console.error('Error storing resources:', error);
  }
}

async function main() {
  const url = 'https://xata.io/docs';
  const resources = await fetchData(url);
  await storeResources(resources);
}

main();