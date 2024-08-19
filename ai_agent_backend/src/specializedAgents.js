const { LLMChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");
const neo4j = require('neo4j-driver');

class SpecializedAgent {
  constructor(specialty, prompt) {
    this.model = new ChatOpenAI({ temperature: 0.5 });
    this.chain = new LLMChain({
      llm: this.model,
      prompt: PromptTemplate.fromTemplate(prompt),
    });
  }

  async processQuery(query, context) {
    const result = await this.chain.call({ query, context: JSON.stringify(context) });
    return { reply: result.text, newContext: { ...context, lastQuery: query, lastReply: result.text } };
  }
}

class WebScrapingAgent extends SpecializedAgent {
  constructor() {
    super("Web Scraping", `You are a web scraping specialist. Given the following query and context, provide a plan or code snippet for web scraping:
    
    Query: {query}
    Context: {context}
    
    Provide a detailed response including any necessary code or steps.`);
  }
}

class KnowledgeGraphAgent extends SpecializedAgent {
  constructor() {
    super("Knowledge Graph", `You are a knowledge graph specialist working with Neo4j. Given the following query and context, provide a plan or Cypher query for creating or querying a knowledge graph:
    
    Query: {query}
    Context: {context}
    
    Provide a detailed response including any necessary Cypher queries or steps.`);
  }
}

class CodingSolutionsAgent extends SpecializedAgent {
  constructor() {
    super("Coding Solutions", `You are a coding solutions specialist. Given the following query and context, provide a coding solution, preferably using data from a Neo4j database:
    
    Query: {query}
    Context: {context}
    
    Provide a detailed response including any necessary code or steps.`);
  }
}

class ContextAgent extends SpecializedAgent {
  constructor() {
    super("Context Management", `You are a context management specialist. Given the following query and context, help manage and organize the user's context:
    
    Query: {query}
    Context: {context}
    
    Provide a detailed response on how to manage or utilize the given context.`);
  }
}

class TimeManagementAgent extends SpecializedAgent {
  constructor() {
    super("Time Management", `You are a time management specialist for individuals with ADHD. Given the following query and context, provide time management advice:
    
    Query: {query}
    Context: {context}
    
    Provide detailed time management strategies or techniques.`);
  }
}

class IdeaCaptureAgent extends SpecializedAgent {
  constructor() {
    super("Idea Capture", `You are an idea capture specialist for individuals with ADHD. Given the following query and context, help capture and organize ideas or thoughts:
    
    Query: {query}
    Context: {context}
    
    Provide detailed strategies for capturing and organizing ideas or thoughts.`);
  }
}

module.exports = {
  WebScrapingAgent,
  KnowledgeGraphAgent,
  CodingSolutionsAgent,
  ContextAgent,
  TimeManagementAgent,
  IdeaCaptureAgent,
};