const { Events } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {
    const currentDateTime = new Date().toLocaleString().replace(",", "");
    console.log("-------------------");
    console.log(`${currentDateTime} ✅ Logged in as ${client.user.tag}`);
  },
};
