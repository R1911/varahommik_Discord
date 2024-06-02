const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Näita teavet boti funktsioonide kohta"),
  async execute(interaction) {
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
    ].join("\n");

    await interaction.reply(infoMessage);
  },
};
