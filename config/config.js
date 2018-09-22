let env = process.env.NODE_ENV || "development";
const config = require(`./${env}.json`);
process.env.NODE_ENV = env;

module.exports = config;