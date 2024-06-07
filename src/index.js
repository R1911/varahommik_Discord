const path = require("node:path");
const fs = require("node:fs");
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  Events,
} = require("discord.js");
const { getEnv } = require("./utlis/environment.js");

const { scheduleCronJobs } = require("./utlis/cronJobs.js");

const client = new Client({
  intents: [
    //GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    //GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    //GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      command.client = client;
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.\n`
      );
    }
  }
}

const readyEvent = require("./events/ready.js");
client.on("ready", (...args) => readyEvent.execute(...args));

client.once("ready", () => {
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    client.on(event.name, (...args) => event.execute(...args));
  }
});

client.on("guildCreate", guild => {
  let welcomeMessage = "Tänan, et lisasite mind oma serverisse!\nSelleks, et ma saaksin korrektselt toimida, palun seadistage teadete kanal kasutades **/seadistateated** käsku (vajab admin õiguseid).";

  //saada teavitus
  const generalChannel = guild.channels.cache.find(channel => 
    channel.name === 'general' && 
    channel.type === ChannelType.GuildText && 
    channel.permissionsFor(guild.me).has("SendMessages")) ||
    guild.channels.cache.find(channel => 
    channel.type === ChannelType.GuildText && 
    channel.permissionsFor(guild.me).has("SendMessages"));

if (generalChannel) {
    generalChannel.send(welcomeMessage).catch(console.error);
} else {
    console.log(`No suitable channel found in guild: ${guild.name} to send a welcome message.`);
}
});

scheduleCronJobs(client);

client.login(getEnv("TOKEN"));
