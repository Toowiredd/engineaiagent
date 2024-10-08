// Generated by Xata Codegen 0.23.5. Please do not edit.
const { buildClient } = require("@xata.io/client");

const tables = [
  {
    name: "users",
    columns: [
      { name: "name", type: "string" },
      { name: "email", type: "string" },
      { name: "created_at", type: "datetime" },
    ],
  },
];

const DatabaseClient = buildClient();

const apiKey = 'xau_UvWYk3BX3S59ckH8d6hqduLPgFh8Sj921';

const defaultOptions = {
  databaseURL: "https://Toowiredd-s-workspace-1u2i58.us-east-1.xata.sh/db/Xata-db",
  apiKey: apiKey
};

class XataClient extends DatabaseClient {
  constructor(options) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance = undefined;

const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};

module.exports = {
  getXataClient,
};