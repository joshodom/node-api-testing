require('dotenv').config();
const express = require('express');
const app = express();
const PORT = 3030;
const TOKEN = process.env.AQI_TOKEN;
const AQI_URI = "https://api.waqi.info/";

app.use(express.json());

app.get('/', (req, res) => {
  res.send(`Welcome to the Express server:${PORT}. You performed a GET request to the root route. Cool choice!`);
});

app.get('/feed/:city', async (req, res) => {
    try {
        const { city } = req.params;
        const aqiData = await fetchAQIFeed(city);
        res.json(aqiData);
    } catch (error) {
        console.error('Error fetching AQI data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
});

app.get('/search/:keyword', async (req, res) => {
    try {
        const { keyword } = req.params;
        const aqiData = await fetchAQISearch(keyword);
        res.json(aqiData);
    } catch (error) {
        console.error('Error fetching AQI data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } 
});

app.get('/feeds', async (req, res) => {
    try{
        var cities = req.body.cities;
        var returnData = [];
        if (!cities) {
            return res.status(400).json({ error: 'Missing cities query parameter' });
        }

        const promises = cities.map(async (city) => {
            const aqiData = await fetchAQIFeed(city);
            return aqiData;
        });
        returnData = await Promise.all(promises);
        res.json(returnData);
    } catch (error) {
        console.error('Error fetching AQI data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function fetchAQIFeed(city) {
  const url = `${AQI_URI}feed/${city}/?token=${TOKEN}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.data === "Unknown station") {
      data.data = `Error retrieving AQI data for ${city}. Please check the city name and try again.`;
  }
  return data;
}

async function fetchAQISearch(keyword) {
  const url = `${AQI_URI}search/?token=${TOKEN}&keyword=${keyword}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}