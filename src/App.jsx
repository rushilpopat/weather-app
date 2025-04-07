import React, { useState } from 'react';

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError('');
      setWeather(null);

      // 1. Get coordinates for the city
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('City not found.');
      }

      const { latitude, longitude, name, country } = geoData.results[0];

      // 2. Get weather for those coordinates
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );
      const weatherData = await weatherResponse.json();

      if (!weatherData.current_weather) {
        throw new Error('Weather data not available.');
      }

      setWeather({
        city: name,
        country,
        temperature: weatherData.current_weather.temperature,
        windspeed: weatherData.current_weather.windspeed,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather();
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #89f7fe, #66a6ff)',
      }}
    >
      <div
        style={{
          background: '#fff',
          padding: '30px',
          borderRadius: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
          width: '350px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>🌤 Open-Meteo Weather App</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}
        >
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ccc',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#0072ff',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
        </form>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {weather && !loading && (
          <div
            style={{
              background: '#f7f7f7',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <h3>
              {weather.city}, {weather.country}
            </h3>
            <p style={{ fontSize: '24px' }}>{weather.temperature}°C</p>
            <p>Wind Speed: {weather.windspeed} km/h</p>
          </div>
        )}

        {!weather && !error && !loading && (
          <p>Enter a city name to see the weather.</p>
        )}
      </div>
    </div>
  );
}
