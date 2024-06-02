const { SlashCommandBuilder, ChannelType } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("seadistateated")
    .setDescription(
      "Seadista kanal kuhu tahad, et iga päevased teated tuleksid."
    )
    .addChannelOption((option) =>
      option
        .setName("kanal")
        .setDescription("Kanal")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    ),
  async execute(interaction) {
    await interaction.deferReply({
      ephemeral: true,
    });
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      return interaction.editReply({
        content: "Selle käskluse kasutamiseks pead olema serveri administraator.",
        ephemeral: true,
      });
    }

    const channel = interaction.options.getChannel("kanal");
    const guildId = interaction.guildId;
    const filePath = path.join(
      __dirname,
      "../..",
      "data",
      "serverSettings.json"
    );

    // Read the current settings
    const settings = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Update the settings
    settings[guildId] = {
      ...settings[guildId],
      announcementsChannel: channel.id,
    };
    fs.writeFileSync(filePath, JSON.stringify(settings, null, 2));

    await interaction.editReply({
      content: `Teadete kanal on seadistatud: ${channel}`,
      ephemeral: true,
    });
  },
};
