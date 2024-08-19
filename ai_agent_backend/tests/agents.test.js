const AutonomousAgent = require('../autonomousAgent');
const {
  WebScrapingAgent,
  KnowledgeGraphAgent,
  CodingSolutionsAgent,
  ContextAgent,
  TimeManagementAgent,
  IdeaCaptureAgent,
} = require('../specializedAgents');

jest.mock('langchain/chains');
jest.mock('langchain/chat_models/openai');

describe('AutonomousAgent', () => {
  let autonomousAgent;
  let mockSpecializedAgents;

  beforeEach(() => {
    mockSpecializedAgents = {
      webScraping: { processQuery: jest.fn() },
      knowledgeGraph: { processQuery: jest.fn() },
      codingSolutions: { processQuery: jest.fn() },
      context: { processQuery: jest.fn() },
      timeManagement: { processQuery: jest.fn() },
      ideaCapture: { processQuery: jest.fn() },
    };
    autonomousAgent = new AutonomousAgent(mockSpecializedAgents);
  });

  test('processQuery routes to the correct specialized agent', async () => {
    const mockResponse = { text: 'webScraping' };
    autonomousAgent.model.call = jest.fn().mockResolvedValue(mockResponse);
    mockSpecializedAgents.webScraping.processQuery.mockResolvedValue({ reply: 'Scraping plan', newContext: {} });

    const result = await autonomousAgent.processQuery('Scrape a website', {});

    expect(result.agent).toBe('webScraping');
    expect(result.reply).toBe('Scraping plan');
  });
});

describe('SpecializedAgents', () => {
  test('WebScrapingAgent processes query correctly', async () => {
    const webScrapingAgent = new WebScrapingAgent();
    webScrapingAgent.chain.call = jest.fn().mockResolvedValue({ text: 'Web scraping plan' });

    const result = await webScrapingAgent.processQuery('Scrape example.com', {});

    expect(result.reply).toBe('Web scraping plan');
    expect(result.newContext).toHaveProperty('lastQuery');
    expect(result.newContext).toHaveProperty('lastReply');
  });

  // Add similar tests for other specialized agents...
});