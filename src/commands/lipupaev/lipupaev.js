const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lipupäev")
    .setDescription("Kas täna on lipupäev?"),
  async execute(interaction) {
    await interaction.deferReply();
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // January is 0

    // Function to check if today matches a flag day
    const isFlagDay = (day, month, year) => {
      const fixedFlagDays = {
        "1/3": "Vabadussõjas võidelnute mälestuspäev",
        "1/30": "Eesti kirjanduse päev",
        "2/2": "Tartu rahulepingu aastapäev",
        "2/24": "Iseseisvuspäev, Eesti Vabariigi aastapäev",
        "3/14": "Emakeelepäev",
        "4/23": "Veteranipäev",
        "5/9": "Euroopa päev",
        "6/1": "Lastekaitsepäev",
        "6/4": "Eesti lipu päev",
        "6/14": "Leinapäev (lipp heisatakse leinalipuna)",
        "6/23": "Võidupüha",
        "6/24": "Jaanipäev",
        "8/20": "Taasiseseisvumispäev",
        "9/1": "Teadmistepäev",
        "10/19": "Hõimupäev",
      };

      // Check for fixed flag days
      if (fixedFlagDays[`${month}/${day}`]) {
        return fixedFlagDays[`${month}/${day}`];
      }

      // Variable flag days based on the day of the week
      const getNthWeekdayOfMonth = (n, weekday, month, year) => {
        let date = new Date(year, month, 1);
        let count = 0;
        while (date.getMonth() === month) {
          if (date.getDay() === weekday) {
            count++;
            if (count === n) return date;
          }
          date.setDate(date.getDate() + 1);
        }
        return null;
      };

      // Second Sunday of May: Mother's Day
      const mothersDay = getNthWeekdayOfMonth(2, 0, 4, year); // 0 is Sunday, 4 is May
      if (
        mothersDay &&
        mothersDay.getDate() === day &&
        mothersDay.getMonth() + 1 === month
      ) {
        return "Emadepäev";
      }

      // Second Sunday of September: Grandparents' Day
      const grandparentsDay = getNthWeekdayOfMonth(2, 0, 8, year); // 0 is Sunday, 8 is September
      if (
        grandparentsDay &&
        grandparentsDay.getDate() === day &&
        grandparentsDay.getMonth() + 1 === month
      ) {
        return "Vanavanemate päev";
      }

      // Second Sunday of November: Father's Day
      const fathersDay = getNthWeekdayOfMonth(2, 0, 10, year); // 0 is Sunday, 10 is November
      if (
        fathersDay &&
        fathersDay.getDate() === day &&
        fathersDay.getMonth() + 1 === month
      ) {
        return "Isadepäev";
      }

      return false;
    };

    // Check if today is a flag day
    const flagDayDescription = isFlagDay(day, month, currentDate.getFullYear());
    if (flagDayDescription) {
      await interaction.editReply(`Täna on lipupäev: ${flagDayDescription}!`);
    } else {
      await interaction.editReply("Täna ei ole lipupäev.");
    }
  },
};
