import { getXataClient } from '../xata';

const xata = getXataClient();

export const messages = {
  getMessages: async (userId, branchName) => {
    const records = await xata.db.messages
      .filter({
        userId: userId,
        branchName: branchName
      })
      .getMany();
    return records;
  },
  sendMessage: async (message) => {
    const record = await xata.db.messages.create(message);
    return record;
  },
  deleteMessage: async (messageId) => {
    await xata.db.messages.delete(messageId);
  },
};

export const branches = {
  getBranches: async (userId) => {
    const records = await xata.db.branches
      .filter({ userId: userId })
      .getMany();
    return records;
  },
  createBranch: async (branchData) => {
    const record = await xata.db.branches.create(branchData);
    return record;
  },
};

export const users = {
  getUser: async (userId) => {
    const user = await xata.db.users.read(userId);
    return user;
  },
  createUser: async (userData) => {
    const user = await xata.db.users.create(userData);
    return user;
  },
  updateUser: async (userId, userData) => {
    const user = await xata.db.users.update(userId, userData);
    return user;
  },
};

export const agents = {
  getAgent: async (agentId) => {
    const agent = await xata.db.agents.read(agentId);
    return agent;
  },
  updateAgent: async (agentId, agentData) => {
    const agent = await xata.db.agents.update(agentId, agentData);
    return agent;
  },
  getUserAgents: async (userId) => {
    const records = await xata.db.agents
      .filter({ userId: userId })
      .getMany();
    return records;
  },
  createAgent: async (agentData) => {
    const agent = await xata.db.agents.create(agentData);
    return agent;
  },
};

export default {
  messages,
  branches,
  users,
  agents,
};