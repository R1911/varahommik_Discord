const fs = require("fs");
const path = require("path");

// Function to create flag day message based on the current date
function createFlagDayMessage() {
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

    if (fixedFlagDays[`${month}/${day}`]) {
      return fixedFlagDays[`${month}/${day}`];
    }

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

    const mothersDay = getNthWeekdayOfMonth(2, 0, 4, year);
    if (
      mothersDay &&
      mothersDay.getDate() === day &&
      mothersDay.getMonth() + 1 === month
    ) {
      return "Emadepäev";
    }

    const grandparentsDay = getNthWeekdayOfMonth(2, 0, 8, year);
    if (
      grandparentsDay &&
      grandparentsDay.getDate() === day &&
      grandparentsDay.getMonth() + 1 === month
    ) {
      return "Vanavanemate päev";
    }

    const fathersDay = getNthWeekdayOfMonth(2, 0, 10, year);
    if (
      fathersDay &&
      fathersDay.getDate() === day &&
      fathersDay.getMonth() + 1 === month
    ) {
      return "Isadepäev";
    }

    return false;
  };

  const flagDayDescription = isFlagDay(day, month, currentDate.getFullYear());

  if (flagDayDescription) {
    return `Täna on lipupäev: ${flagDayDescription}!`;
  } else {
    return `Täna ei ole lipupäev.`;
  }
}

// Function to post flag day message to the specified channel
async function postFlagDayMessage(client) {
  const filePath = path.join(__dirname, "..", "data", "serverSettings.json");
  const settings = JSON.parse(fs.readFileSync(filePath, "utf8"));

  client.guilds.cache.forEach(async (guild) => {
    const guildSettings = settings[guild.id];
    if (!guildSettings || !guildSettings.announcementsChannel) {
      console.log(`No announcements channel set for guild ${guild.id}.`);
      return;
    }

    const content = createFlagDayMessage();
    if (content) {
      try {
        const channel = await client.channels.fetch(
          guildSettings.announcementsChannel
        );
        await channel.send({ content });
      } catch (error) {
        console.error(
          `Error while posting flag day message in guild ${guild.id}:`,
          error
        );
      }
    }
  });
}

module.exports = { postFlagDayMessage };
