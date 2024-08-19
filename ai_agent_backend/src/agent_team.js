const { LLMChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");
const { ChainTool } = require("langchain/tools");

class AgentTeam {
  constructor() {
    this.model = new ChatOpenAI({ temperature: 0 });
    this.agents = {
      timeManagement: this.createAgent("time management"),
      focusAndConcentration: this.createAgent("focus and concentration"),
      taskPrioritization: this.createAgent("task prioritization"),
      emotionalSupport: this.createAgent("emotional support"),
      routineBuilding: this.createAgent("routine building")
    };
  }

  createAgent(specialty) {
    const chain = new LLMChain({
      llm: this.model,
      prompt: PromptTemplate.fromTemplate(
        `You are an AI assistant specializing in ${specialty} for individuals with ADHD. 
         Use the following context from recent activities to inform your answer: {context}
         
         Now, provide advice related to ${specialty} for the following situation: {situation}`
      ),
    });

    return new ChainTool({
      name: specialty,
      description: `Useful for providing ${specialty} advice for individuals with ADHD`,
      chain: chain,
    });
  }

  async processQuery(query, context) {
    const results = await Promise.all(
      Object.values(this.agents).map(agent => 
        agent.call({ situation: query, context: context })
      )
    );

    // Combine and summarize results
    const combinedResults = results.map(r => r.output).join('\n\n');
    const summaryChain = new LLMChain({
      llm: this.model,
      prompt: PromptTemplate.fromTemplate(
        `Summarize and combine the following pieces of advice for an individual with ADHD:
         {combinedResults}
         
         Provide a coherent response that addresses the user's query: {query}`
      ),
    });

    const summary = await summaryChain.call({ 
      combinedResults: combinedResults,
      query: query
    });

    return summary.text;
  }
}

module.exports = AgentTeam;