const { SlashCommandBuilder } = require("discord.js");
const { scrapeWeatherDetails } = require("../../services/weatherScraper.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ilmateade")
    .setDescription("Näita praegust ilmateadet")
    .addStringOption((option) =>
      option
        .setName("asukoht")
        .setDescription("Spetsiifilise asukoha ilmateade")
        .setRequired(false)
        .addChoices(
          { name: "Harku", value: "Harku" },
          { name: "Jõhvi", value: "Jõhvi" },
          { name: "Tartu", value: "Tartu" },
          { name: "Pärnu", value: "Pärnu" },
          { name: "Kuressaare", value: "Kuressaare" },
          { name: "Türi", value: "Türi" },
          { name: "Haapsalu", value: "Haapsalu" },
          { name: "Kärdla", value: "Kärdla" },
          { name: "Viljandi", value: "Viljandi" },
          { name: "Rakvere", value: "Rakvere" },
          { name: "Valga", value: "Valga" },
          { name: "Võru", value: "Võru" },
          { name: "Narva", value: "Narva" },
          { name: "Paide", value: "Paide" },
          { name: "Rapla", value: "Rapla" },
          { name: "Jõgeva", value: "Jõgeva" },
          { name: "Põlva", value: "Põlva" },
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();
    let asukoht = interaction.options.getString("asukoht");
    const weather = await scrapeWeatherDetails();

    if (asukoht) {
      const placeWeather = weather.places.find(
        (place) => place.name.toLowerCase() === asukoht.toLowerCase()
      );

      if (placeWeather) {
        await interaction.editReply({
          content:
            `Ilmateade asukohale ${placeWeather.name}:\n` +
            `- ${placeWeather.phenomenon}\n` +
            `- Maksimaalne temperatuur: ${placeWeather.tempmax}°C`,
        });
      } else {
        await interaction.editReply({
          content: `Asukohta "${asukoht}" ei leitud. Palun kontrolli nime õigekirja ja proovi uuesti.`,
        });
      }
    } else {
      await interaction.editReply({
        content: `Üldine ilmateade:\n${weather.text}`,
      });
    }
  },
};
