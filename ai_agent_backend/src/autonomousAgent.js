const { LLMChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PromptTemplate } = require("langchain/prompts");

class AutonomousAgent {
  constructor(specializedAgents) {
    this.model = new ChatOpenAI({ temperature: 0.7 });
    this.specializedAgents = specializedAgents;
    this.currentContext = null;
  }

  async processQuery(query, userContext) {
    const routerChain = new LLMChain({
      llm: this.model,
      prompt: PromptTemplate.fromTemplate(
        `You are an AI assistant that routes queries to specialized agents. Given the following query and context, determine which specialized agent would be best suited to handle this request. The available agents are: ${Object.keys(this.specializedAgents).join(", ")}.

        User query: {query}
        User context: {context}

        Respond with the name of the most appropriate specialized agent to handle this query.`
      ),
    });

    const { text: chosenAgent } = await routerChain.call({
      query: query,
      context: JSON.stringify(userContext),
    });

    if (this.specializedAgents[chosenAgent]) {
      const result = await this.specializedAgents[chosenAgent].processQuery(query, this.currentContext || userContext);
      this.currentContext = result.newContext;
      return { reply: result.reply, agent: chosenAgent };
    } else {
      return { reply: "I'm sorry, I couldn't find an appropriate agent to handle your query.", agent: "none" };
    }
  }

  resetContext() {
    this.currentContext = null;
  }
}

module.exports = AutonomousAgent;