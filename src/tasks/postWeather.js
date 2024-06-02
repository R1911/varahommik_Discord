const fs = require('fs');
const path = require('path');
const { scrapeWeatherDetails } = require('../services/weatherScraper.js');

async function postWeather(client) {
    const filePath = path.join(__dirname, '..', 'data', 'serverSettings.json');
    const settings = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    client.guilds.cache.forEach(async guild => {
        const guildSettings = settings[guild.id];
        if (!guildSettings || !guildSettings.announcementsChannel) {
            console.log(`No announcements channel set for guild ${guild.id}.`);
            return;
        }

        try {
            const weather = await scrapeWeatherDetails();
            const { text } = weather;
            let weatherContent = `${text}`;

            const channel = await client.channels.fetch(guildSettings.announcementsChannel);
            await channel.send({ content: weatherContent });
        } catch (error) {
            console.error(`Failed to post weather update in guild ${guild.id}:`, error);
        }
    });
}

module.exports = { postWeather };