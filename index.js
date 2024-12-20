document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '281d286587e1992e160690ae9fd2ff88';
  const searchForm = document.getElementById('searchForm');
  const cityInput = document.getElementById('cityInput');
  const currentWeather = document.getElementById('currentWeather');
  const forecast = document.getElementById('forecast');

  // Fetch weather data
  const fetchWeather = async (city) => {
      try {
          const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
          );
          const data = await response.json();
          displayCurrentWeather(data);

          const forecastResponse = await fetch(
              `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
          );
          const forecastData = await forecastResponse.json();
          displayForecast(forecastData);
      } catch (error) {
          alert('Error fetching weather data. Please check the city name.');
      }
  };

  // Display current weather
  const displayCurrentWeather = (data) => {
      const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      currentWeather.innerHTML = `
          <h2>${data.name}</h2>
          <img src="${weatherIcon}" alt="${data.weather[0].description}">
          <p>${data.weather[0].description}</p>
          <h3>${data.main.temp}°C</h3>
          <p>Humidity: ${data.main.humidity}%</p>
          <p>Wind Speed: ${data.wind.speed} m/s</p>
      `;

      // Update background based on weather
      document.body.style.backgroundImage = getBackgroundImage(data.weather[0].main);
  };

  // Display 5-day forecast
  const displayForecast = (data) => {
      forecast.innerHTML = '';
      const filteredData = data.list.filter((item) => item.dt_txt.includes('12:00:00'));

      filteredData.forEach((day) => {
          const date = new Date(day.dt_txt).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
          });
          const weatherIcon = `https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

          forecast.innerHTML += `
              <div class="col-12 col-sm-6 col-md-2 forecast-card">
                  <h5>${date}</h5>
                  <img src="${weatherIcon}" alt="${day.weather[0].description}">
                  <p>${day.weather[0].description}</p>
                  <h6>${day.main.temp}°C</h6>
              </div>
          `;
      });
  };

  // Get dynamic background
  const getBackgroundImage = (weather) => {
      const weatherBackgrounds = {
          Clear: "url('https://source.unsplash.com/1600x900/?sunny')",
          Rain: "url('https://source.unsplash.com/1600x900/?rain')",
          Clouds: "url('https://source.unsplash.com/1600x900/?cloudy')",
          Snow: "url('https://source.unsplash.com/1600x900/?snow')",
          Mist: "url('https://source.unsplash.com/1600x900/?mist')",
      };
      return weatherBackgrounds[weather] || "url('https://source.unsplash.com/1600x900/?weather')";
  };

  // Handle form submission
  searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const city = cityInput.value.trim();
      if (city) {
          fetchWeather(city);
      }
  });
});
