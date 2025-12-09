const apiKey = "2185d8c4a2897f513055b23f6bee0c0c";

document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        showError("Please enter a city name.");
    }
});

document.getElementById("cityInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        document.getElementById("searchBtn").click();
    }
});

function fetchWeather(city) {
    const api = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(api)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => displayWeather(data))
        .catch(error => showError(error.message));
}

function displayWeather(data) {
    document.getElementById("errorMsg").textContent = "";
    document.getElementById("weatherCard").style.display = "block";

    document.getElementById("cityName").textContent = data.name;
    document.getElementById("temperature").textContent = data.main.temp;
    document.getElementById("humidity").textContent = data.main.humidity;
    document.getElementById("seaLevel").textContent = data.main.sea_level ? data.main.sea_level : "N/A";
    document.getElementById("description").textContent = data.weather[0].description;
    document.getElementById("wind").textContent = data.main.wind;


    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    document.getElementById("weatherIcon").src = iconUrl;
}

function showError(message) {
    document.getElementById("weatherCard").style.display = "none";
    document.getElementById("errorMsg").textContent = message;
}

