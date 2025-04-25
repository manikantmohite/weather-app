const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());

// Serve frontend files from the "frontend" folder
app.use(express.static(path.join(__dirname, 'frontend')));

// Route for base URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Weather route
app.get('/weather', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.API_KEY;

  if (!city) {
    return res.status(400).json({ error: 'City is required in the query string' });
  }

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API key. Please set it in the .env file' });
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    const { name, main, weather } = response.data;

    res.json({
      city: name,
      temperature: main.temp,
      humidity: main.humidity,
      condition: weather[0].description,
      icon: `http://openweathermap.org/img/w/${weather[0].icon}.png`
    });
  } catch (err) {
    console.error('Error fetching weather:', err.message);
    const message =
      err.response?.status === 404
        ? 'City not found'
        : 'Could not fetch weather data. Try again later.';
    res.status(500).json({ error: message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
