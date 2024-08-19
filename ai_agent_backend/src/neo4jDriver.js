const neo4j = require('neo4j-driver');
const config = require('../config/config');

const driver = neo4j.driver(
  config.neo4j.uri,
  neo4j.auth.basic(config.neo4j.user, config.neo4j.password)
);

const session = driver.session();

module.exports = {
  driver,
  session,
  close: () => driver.close()
};