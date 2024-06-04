const axios = require("axios");
const { parseString } = require("xml2js");

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

const coordinates = {
  Harku: { lat: 59.4010, lon: 24.6026 },
  Jõhvi: { lat: 59.3598, lon: 27.4210 },
  Tartu: { lat: 58.3776, lon: 26.7290 },
  Pärnu: { lat: 58.3859, lon: 24.4971 },
  Kuressaare: { lat: 58.2525, lon: 22.4869 },
  Türi: { lat: 58.8085, lon: 25.4317 },
  Haapsalu: { lat: 58.9431, lon: 23.5414 },
  Kärdla: { lat: 58.9965, lon: 22.7496 },
  Viljandi: { lat: 58.3639, lon: 25.5900 },
  Rakvere: { lat: 59.3469, lon: 26.3558 },
  Valga: { lat: 57.7776, lon: 26.0474 },
  Võru: { lat: 57.8428, lon: 27.0174 },
  Narva: { lat: 59.3797, lon: 28.1791 },
  Paide: { lat: 58.8857, lon: 25.5575 },
  Rapla: { lat: 58.9994, lon: 24.7931 },
  Jõgeva: { lat: 58.7460, lon: 26.3933 },
  Põlva: { lat: 58.0584, lon: 27.0714 },
};

function interpolate(lat1, lon1, temp1, lat2, lon2, temp2, targetLat, targetLon) {
  const distance1 = Math.sqrt(Math.pow(lat1 - targetLat, 2) + Math.pow(lon1 - targetLon, 2));
  const distance2 = Math.sqrt(Math.pow(lat2 - targetLat, 2) + Math.pow(lon2 - targetLon, 2));
  return ((temp1 * distance2) + (temp2 * distance1)) / (distance1 + distance2);
}

async function parseWeatherData(xmlData) {
  return new Promise((resolve, reject) => {
    parseString(xmlData, (err, result) => {
      if (err) {
        return reject(err);
      }
      const places = result.forecasts.forecast[0].day[0].place.map((place) => ({
        name: place.name[0],
        phenomenon: place.phenomenon[0],
        tempmax: parseInt(place.tempmax[0], 10),
      }));
      const weatherDetails = result.forecasts.forecast[0].day[0];
      const text = weatherDetails.text ? weatherDetails.text[0] : "Ilmateade puudub.";

      resolve({ places, text });
    });
  });
}

async function estimateIntermediateWeather(xmlData) {
  const { places, text } = await parseWeatherData(xmlData);

  places.forEach(place => {
    coordinates[place.name] = { ...coordinates[place.name], tempmax: place.tempmax, phenomenon: place.phenomenon };
  });

  const targetLocations = Object.keys(coordinates).filter(location => !coordinates[location].tempmax);
  const estimatedWeather = targetLocations.map(location => {
    const target = coordinates[location];

    const [place1, place2] = places.sort((a, b) => {
      const distA = Math.sqrt(Math.pow(coordinates[a.name].lat - target.lat, 2) + Math.pow(coordinates[a.name].lon - target.lon, 2));
      const distB = Math.sqrt(Math.pow(coordinates[b.name].lat - target.lat, 2) + Math.pow(coordinates[b.name].lon - target.lon, 2));
      return distA - distB;
    }).slice(0, 2);

    const lat1 = coordinates[place1.name].lat;
    const lon1 = coordinates[place1.name].lon;
    const temp1 = place1.tempmax;

    const lat2 = coordinates[place2.name].lat;
    const lon2 = coordinates[place2.name].lon;
    const temp2 = place2.tempmax;

    const estimatedTemp = interpolate(lat1, lon1, temp1, lat2, lon2, temp2, target.lat, target.lon);

    return {
      name: location,
      tempmax: Math.round(estimatedTemp),
      phenomenon: place1.phenomenon, 
    };
  });

  return { places: [...places, ...estimatedWeather], text };
}

async function scrapeWeatherDetails() {
  try {
    const response = await axios.get(
      "https://www.ilmateenistus.ee/ilma_andmed/xml/forecast.php"
    );
    const xmlData = response.data;

    const weatherData = await estimateIntermediateWeather(xmlData);

    const allPlacesWeather = weatherData.places.map(place => ({
      name: place.name,
      phenomenon: engToEstPhrase(place.phenomenon),
      tempmax: place.tempmax,
    }));

    return { places: allPlacesWeather, text: weatherData.text };
  } catch (error) {
    console.error(`Error scraping weather details:`, error);
    throw error;
  }
}

module.exports = { scrapeWeatherDetails };