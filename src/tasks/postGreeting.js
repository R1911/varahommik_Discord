const fs = require("fs");
const path = require("path");

function createGreeting() {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;

  let content = "Tere varahommikust! 🌞\nLoodan, et sul tuleb hea päev!";

  if (month === 6 && day === 24) {
    content =
      "Tere varahommikust ning häid jaane! 🌞\nLoodan, et sul tuleb imeline jaanipäev!";
  } else if (month === 6 && day === 23) {
    content =
      "Tere varahommikust! 🌞\nIlusat võidupüha! Loodan, et sul tuleb täna suurepärane päev!";
  } else if (month === 12 && day === 24) {
    content =
      "Head varajast jõuluhommikut! 🌞\nLoodan, et sul on imelised ning rahulikud jõulud!";
  } else if (month === 2 && day === 24) {
    content =
      "Tere varahommikust Eestimaa rahvas! 🌞\nImelist vabariigi aastapäeva!";
  } else if (month === 8 && day === 20) {
    content =
      "Tere varahommikust! 🌞\nLoodan, et naudid tänast taasiseseisvumispäeva!";
  } else if (month === 1 && day === 1) {
    content =
      "Tere varahommikust ning head uut aastat! 🌞\nLoodan, et su uue aasta esimene päev tuleb vahva!";
  } else if ((month === 12 && day === 30) || (month === 12 && day === 31)) {
    content =
      "Tere varahommikust, ning head vana aasta lõppu! 🌞\nLoodan et sul tuleb hea päev!";
  }

  return content;
}

async function postGreeting(client) {
  const filePath = path.join(__dirname, "..", "data", "serverSettings.json");
  const settings = JSON.parse(fs.readFileSync(filePath, "utf8"));

  client.guilds.cache.forEach(async (guild) => {
    const guildSettings = settings[guild.id];
    if (!guildSettings || !guildSettings.announcementsChannel) {
      console.log(`No announcements channel set for guild ${guild.id}.`);
      return;
    }

    const content = createGreeting();
    if (content) {
      try {
        const channel = await client.channels.fetch(
          guildSettings.announcementsChannel
        );
        await channel.send({ content });
      } catch (error) {
        console.error(
          `Error while posting greeting message in guild ${guild.id}:`,
          error
        );
      }
    }
  });
}

//postGreeting(client);
module.exports = { postGreeting };
