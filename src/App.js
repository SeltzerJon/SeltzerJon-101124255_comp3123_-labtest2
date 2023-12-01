import React, { useState, useEffect } from 'react';
import './App.css';

function getWeatherIcon(iconCode, conditionText) {
  return (
    <div className="Weather-icon">
      <img
        src={`https://openweathermap.org/img/wn/${iconCode}.png`}
        alt={`${iconCode} icon`}
        className="Weather-icon-img"
      />
      <p>{conditionText}</p>
    </div>
  );
}


function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  // API KEY
  const apiKey = 'd7e1c893479d73d41d0321af9464f1c2'; 
  const city = 'Toronto';

  useEffect(() => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        setWeatherData(prevState => ({ ...prevState, currentDay: data }));
      })
      .catch(err => {
        setError(err);
      });
  }, [apiKey, city]);

  useEffect(() => {
    // Fetch weather forecast for the next 5 days 
    // API KEY
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
      .then(response => response.json())
      .then(data => {
        // Filters data for today and next 5 days
        const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const forecastData = data.list.filter(item => {
          const itemDate = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
          return itemDate === currentDate || item.dt_txt.includes('12:00:00');
        });

        // Separate current day and upcoming weekdays data
        const [currentDay, ...weekdaysData] = forecastData;
        setWeatherData(prevState => ({ ...prevState, currentDay, weekdays: weekdaysData }));
      })
      .catch(err => {
        setError(err);
      });
  }, [apiKey, city]);

  return (
    <div className="App">
      <header className="App-header">

        {/* Display Current day data */}
        {error && <p>Error: {error.message}</p>}
        {weatherData && weatherData.currentDay && (
          <div className="Weather-info">
            <p style={{ fontSize: '25px' }}>Today</p>
            <p>City: {weatherData.currentDay.main.city}Toronto</p>
            <p>Current Temperature: {weatherData.currentDay.main.temp}°C</p>
            <p>Humidity: {weatherData.currentDay.main.humidity}%</p>
            <p>Wind Speed: {weatherData.currentDay.wind.speed} m/s</p>
            <p>Air Pressure: {weatherData.currentDay.main.pressure} hPa</p>
            <p>Max Temperature: {weatherData.currentDay.main.temp_max}°C</p>
            <p>Min Temperature: {weatherData.currentDay.main.temp_min}°C</p>
            {/* Display weather icon based off weather con */}
            {weatherData.currentDay.weather && weatherData.currentDay.weather[0] && (
            <div className="Weather-icon">
            {getWeatherIcon(
            weatherData.currentDay.weather[0].icon,
            weatherData.currentDay.weather[0].description
    )}
  </div>
)}
          </div>
        )}

        {/* Display weather data for upcoming weekdays */}
        {weatherData && weatherData.weekdays && (
          <div className="Weekday-forecast">
            <h2>Upcoming Forecasts:</h2>
            {weatherData.weekdays.map(day => (
              <div className="Weekday-card" key={day.dt}>
                <p>{new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' })}</p>
                <p>Temperature: {day.main.temp}°C</p>
                {/* Display weather icon  based on each day's weather con */}
                {day.weather && day.weather[0] && getWeatherIcon(day.weather[0].icon)}
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
