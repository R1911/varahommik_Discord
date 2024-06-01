const { REST } = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { Routes } = require("discord-api-types/v9");


const commands = [];

// Grab all the command folders from the commands directory
const foldersPath = path.join(__dirname, "./src/commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    if ("data" in command) {
      // If it's a top-level command, add it to the commands array
      commands.push(command.data);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" property.`
      );
    }
  }
}

// Construct an instance of the REST module
const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

(async () => {
    try {
      console.log(
        `Started refreshing ${commands.length} application (/) commands for guild ${process.env.guildId}`
      );
  
      await rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), {
        body: commands,
      });
  
      console.log(`Successfully deployed commands to guild ${process.env.guildId}.`);
    } catch (error) {
      console.error(error);
    }
  })();