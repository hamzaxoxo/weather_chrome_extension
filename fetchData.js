const API_KEY = 'e4f273e6c4c93188f9964501de66d735';
const DEFAULT_LOCATION = 'New York';

function showLoading() {
    document.getElementById("loading").style.display = "block";
    document.getElementById("weather-info").style.display = "none";
}

function hideLoading() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("weather-info").style.display = "block";
}
function fetchWeatherData(lat, lon, locationName = '') {
    const url = locationName ?
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(locationName)}&units=metric&appid=${API_KEY}` :
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(jsonData => {
            // Hide "Location not Found" message
            document.getElementById("not_found").style.display = "none";

            // Display weather information
            document.getElementById("city_name").innerHTML = jsonData.name;
            document.getElementById("badge").innerHTML = jsonData.sys.country || '';
            document.getElementById("text_temp").innerHTML = `${Math.round(jsonData.main.temp)}°C`;
            document.getElementById("text_feelslike").innerHTML = `${Math.round(jsonData.main.feels_like)}°C`;
            document.getElementById("text_humidity").innerHTML = `${jsonData.main.humidity}%`;
            document.getElementById("text_wind").innerHTML = `${Math.round(jsonData.wind.speed)} m/s`;
            document.getElementById("text_desc").innerHTML = jsonData.weather[0].description.charAt(0).toUpperCase() + jsonData.weather[0].description.slice(1);

            const weatherIcon = jsonData.weather[0].icon;
            document.getElementById("weather_icon").src = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

            const updateTime = new Date().toLocaleTimeString();
            document.getElementById("footer").innerHTML = `Last updated: ${updateTime}`;

            // Show the weather info
            document.getElementById("weather-details").style.display = "block";
            hideLoading();
        })
        .catch(error => {
            document.getElementById("weather-details").style.display = "none";
            document.getElementById("not_found").style.display = "block";
            hideLoading();
        });
}

function getWeatherForDefaultLocation() {
    fetchWeatherData(null, null, DEFAULT_LOCATION);
}

function handleGeolocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    fetchWeatherData(lat, lon);
}

function handleGeolocationError() {
    getWeatherForDefaultLocation();
}

function getGeolocation() {
    if (navigator.geolocation) {
        showLoading();
        navigator.geolocation.getCurrentPosition(handleGeolocationSuccess, handleGeolocationError);
    } else {
        console.log("Geolocation is not supported by this browser.");
        getWeatherForDefaultLocation();
    }
}

// Start the process
getGeolocation();

// Add event listener to the search button
document.getElementById('search-button').addEventListener('click', () => {
    const locationName = document.getElementById('location-input').value;
    if (locationName) {
        showLoading();
        fetchWeatherData(null, null, locationName);
    }
});