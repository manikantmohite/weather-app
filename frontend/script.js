async function getWeather() {
    const city = document.getElementById('cityInput').value;
    if (!city) return alert("Please enter a city!");
  
    try {
      const response = await fetch(`/weather?city=${city}`);
      const data = await response.json();
  
      if (data.error) throw new Error(data.error);
  
      document.getElementById('weatherInfo').innerHTML = `
        <h2>${data.city}</h2>
        <p>Temperature: ${data.temperature} °C</p>
        <p>Humidity: ${data.humidity}%</p>
        <p>Condition: ${data.condition}</p>
        <img src="${data.icon}" alt="${data.condition}">
      `;
    } catch (err) {
      document.getElementById('weatherInfo').innerHTML = `<p style="color:red;">${err.message}</p>`;
    }
  }
  