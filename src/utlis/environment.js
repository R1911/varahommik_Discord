require("dotenv").config({ path: `${__dirname}/../../.env` });

const getEnv = (key, defaultValue = '') => process.env[key] || defaultValue;

module.exports = { getEnv };