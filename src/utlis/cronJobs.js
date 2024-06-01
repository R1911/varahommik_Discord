const cron = require("node-cron");

const scheduleCronJobs = (client) => {
  const { postGreeting } = require("../tasks/postGreeting.js");
  cron.schedule("0 0 7 * * *", () => {
    postGreeting(client);
  });

  const { postWeather } = require("../tasks/postWeather.js");
  cron.schedule("0 0 8 * * *", () => {
    postWeather(client);
  });
};

module.exports = { scheduleCronJobs };
