const { SlashCommandBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Näita teavet boti funktsioonide kohta"),
  async execute(interaction) {
    const isAdmin = interaction.member.permissions.has("ADMINISTRATOR");

    const filePath = path.join(__dirname, '../..', 'data', 'serverSettings.json');
    const settings = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const announcementsChannel = settings[interaction.guildId]?.announcementsChannel;

    const infoMessage = [
      "🤖 **Boti Teave:**",
      "• **Igapäevased Tervitused:** Saadab tervitussõnumi igal päeval määratud teadete kanalisse.",
      "• **Igapäevane Ilmateade:** Pakub iga päev ilmaprognoosi teadete kanalis.",
      "• **Lipupäeva Teated:** Teavitab, kas täna on lipupäev ja esitab asjakohast teavet teadete kanalis.",
      "",
      "🛠 **Käsud:**",
      "• **/info:** Näitab teavet boti funktsioonide kohta.",
      "• **/ilmateade:** Kuvab tänase ilmaprognoosi - kas üle-Eestilise või spetsiifilise asukoha kohta.",
      "• **/lipupäev:** Informeerib, kas täna on lipupäev ning annab vastavaid üksikasju.",
      "• **/seadistateated:** Võimaldab administraatoritel määrata teadete kanali, kuhu bot oma igapäevased teateid saadab."
    ];

    // Add a visual separator and specific channel info for admins
    if (isAdmin && announcementsChannel) {
      infoMessage.push(
        "\n——————————————————————————\n",
        `**Teavituste Kanal:** Teavitused on seadistatud kanalisse <#${announcementsChannel}>.`
      );
    } else if (isAdmin) {
      infoMessage.push(
        "\n——————————————————————————\n",
        "**Teavituste Kanal:** Teavituste kanal ei ole veel seadistatud."
      );
    }

    await interaction.reply(infoMessage.join("\n"));
  },
};
