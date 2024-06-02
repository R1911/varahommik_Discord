const cron = require("node-cron");

const scheduleCronJobs = (client) => {
  const { postGreeting } = require("../tasks/postGreeting.js");
  cron.schedule("0 0 7 * * *", () => {
  //cron.schedule("0 */2 * * * *", () => {
    postGreeting(client);
  });

  const { postFlagDayMessage } = require("../tasks/postFlagDay.js");
  cron.schedule("30 0 7 * * *", () => {
  //cron.schedule("10 */2 * * * *", () => {
    postFlagDayMessage(client);
  });

  const { postWeather } = require("../tasks/postWeather.js");
  cron.schedule("0 0 8 * * *", () => {
  //cron.schedule("20 */2 * * * *", () => {
    postWeather(client);
  });
};

module.exports = { scheduleCronJobs };
