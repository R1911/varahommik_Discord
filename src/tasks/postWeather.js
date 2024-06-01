const greetingsChannel = "1246429428397903904";
const { scrapeWeatherDetails } = require('../services/weatherScraper.js');
const fs = require('fs');
const path = require('path');

// Function to prepare and tweet weather update
async function postWeather(client) {
    try {
        const weather = await scrapeWeatherDetails();
        const { text } = weather;
        let weatherContent;

        weatherContent = `${text}`;

        // Read the last tweet ID to reply to
        /*
        const tweetDataPath = path.join(__dirname, "../tweet.json");
        const tweetDataRaw = fs.readFileSync(tweetDataPath);
        const { tweetId } = JSON.parse(tweetDataRaw);
        */
        // Reply to the previous tweet with weather update
        const channel = await client.channels.fetch(greetingsChannel);
        await channel.send({ content: weatherContent });
        
        // console.info(`Replied to tweet ID: ${tweetId} with weather update.`);
    } catch (error) {
        console.error(`Failed to post weather update:`, error);
    }
}

module.exports = { postWeather };