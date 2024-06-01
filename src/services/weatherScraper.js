const axios = require("axios");
const { parseString } = require("xml2js");
//const { getDateTime } = require("../utils/dateTimeHelper");

function engToEstPhrase(phenomenon) {
  const phrases = {
    Clear: "Ilm on selge.",
    "Few clouds": "Ilm on vähese pilvisusega.",
    "Scattered clouds": "Ilm on hajusa pilvisusega",
    "Broken clouds": "Ilm on vahelduva pilvisusega.",
    "Light shower": "Kohati sajab kerget hoovihma.",
    "Moderate shower": "Kohati sajab mõõdukat hoovihma.",
    Rain: "Ilm on vihmane.",
    Thunderstorm: "Kohati on äikeseoht.",
    Snow: "Sajab lund.",
    Mist: "Ilm on udune.",
  };

  return phrases[phenomenon] || `Ilm on ${phenomenon.toLowerCase()}`;
}

async function scrapeWeatherDetails() {
  try {
    const response = await axios.get(
      "https://www.ilmateenistus.ee/ilma_andmed/xml/forecast.php"
    );
    const xmlData = response.data;

    // Parse XML
    let jsonData;
    parseString(xmlData, (err, result) => {
      if (err) {
        throw err;
      }
      jsonData = result;
    });

    const weatherDetails = jsonData.forecasts.forecast[0].day[0];
    const tempmin = parseInt(weatherDetails.tempmin[0], 10);
    const tempmax = parseInt(weatherDetails.tempmax[0], 10);
    const text = weatherDetails.text[0];

    const placesWeather = weatherDetails.place.map((place) => ({
      name: place.name[0],
      phenomenon: engToEstPhrase(place.phenomenon[0]),
      tempmax: parseInt(place.tempmax[0], 10),
    }));

    return {
      text: text,
      tempmin: tempmin,
      tempmax: tempmax,
      places: placesWeather,
    };
  } catch (error) {
    console.error(`Error scraping weather details:`, error);
    throw error;
  }
}

module.exports = { scrapeWeatherDetails };
