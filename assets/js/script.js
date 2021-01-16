var apiKey = "411165753b54ef779d0c21d853c22321";
var city = "San Francisco";
var previousCities = [];
//search elements
var cityInputEl = document.querySelector("#citySearch");
var cityFormEl = document.querySelector("#cityForm");
var previousCitiesEl = document.querySelector("#previousCities");
//todays weather elements
var todaysCityEl = document.querySelector("#cityName");
var todaysDateEl = document.querySelector("#cityDate");
var todayTempEl = document.querySelector("#todayTemp");
var todayHumiEl = document.querySelector("#todayHumi");
var todayWindEl = document.querySelector("#todayWind");
var todayUvEl = document.querySelector("#todayUv");
//5-day forecast elements
var fiveDayEl = document.querySelector("#fiveDay");
//handler for city search 
var citySubmitHandler = function (event) {
    //prevent page reload on submit
    event.preventDefault();
    //gets value of searched city
    var citySearch = cityInputEl.value.trim();
    //verifies truthiness
    if (citySearch) {
        getWeather(citySearch);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
}
//fetches daily weather data from api
var getWeather = function (city) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;
    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {
                response.json().then(function (data) {
                    showWeather(data);
                    if (previousCities[0] === city || previousCities[1] === city || previousCities[2] === city || previousCities[3] === city) {
                        showPrevious();
                    } else {
                        previousCities.splice(0, 0, city);
                        //stores previous searches in localstorage
                        localStorage.setItem("cities", JSON.stringify(previousCities));
                        showPrevious();
                    }
                });
            } else {
                alert("Error: " + response.statusText + ". Try a different city!");
            }
        })
        .catch(function (error) {
            alert("Unable to get weather");
        });
}
//displays daily weather data and fetches 5-day forecast
var showWeather = function (data) {
    //create png icon
    var dailyWeatherPng = document.createElement("img");
    dailyWeatherPng.setAttribute("src", "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png");
    dailyWeatherPng.classList = "bg-white mb-2";
    //city name
    todaysCityEl.textContent = data.name;
    //date
    todaysDateEl.textContent = moment(data.dt * 1000).format("[  ](M/DD/YYYY)");
    //append png icon for forecasted weather
    todaysDateEl.appendChild(dailyWeatherPng);
    //temperature
    todayTempEl.textContent = Math.floor(data.main.temp) + "ºF";
    //humidity
    todayHumiEl.textContent = Math.floor(data.main.humidity) + "%";
    //wind speed
    todayWindEl.textContent = data.wind.speed + " MPH"

    //lon & lat for 5-day forecast fetch
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    //api fetch for 5-day froecast
    var fiveDayApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(fiveDayApi)
        .then(function (response) {

            if (response.ok) {
                response.json().then(function (data) {
                    fiveDayForecast(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to get weather");
        });
}
//displays 5-day forecast
var fiveDayForecast = function (data) {
    //uv index handling and display
    var uvIndex = data.current.uvi;
    todayUvEl.textContent = uvIndex
    if (uvIndex < 3) {
        todayUvEl.classList = "bg-success p-3 text-white rounded";
    } else if (uvIndex > 2 && uvIndex < 6) {
        todayUvEl.classList = "bg-warning p-3 text-white rounded";
    } else {
        todayUvEl.classList = "bg-danger p-3 text-white rounded";
    }

    fiveDayEl.innerHTML = "";
    for (i = 1; i < 6; i++) {
        //creates card for 5-day forecast
        var dailyForecast = document.createElement("div");
        dailyForecast.classList = "card bg-primary text-white m-2 col-2";
        //displays date of forecasted weather
        var dailyForecastDate = document.createElement("div");
        dailyForecastDate.classList = "card-header";
        dailyForecastDate.textContent = moment(data.daily[i].dt * 1000).format("[ ]M/DD/YYYY");
        dailyForecast.appendChild(dailyForecastDate);
        //displays png icon of forecasted weather condition
        var dailyWeatherPng = document.createElement("img");
        dailyWeatherPng.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        dailyWeatherPng.classList = "bg-white mb-2"
        dailyForecast.appendChild(dailyWeatherPng);
        //displays forecasted temperature
        var dailyTemp = document.createElement("p");
        dailyTemp.textContent = "Temp: " + Math.floor(data.daily[i].temp.day) + "ºF";
        dailyForecast.appendChild(dailyTemp);
        //displays forecasted humidity
        var dailyHumi = document.createElement("p");
        dailyHumi.textContent = "Humidity: " + Math.floor(data.daily[i].humidity) + "%";
        dailyForecast.appendChild(dailyHumi);
        //appends forecast card to html
        fiveDayEl.appendChild(dailyForecast);
    }
}
//displays previous weather searches
var showPrevious = function () {
    previousCitiesEl.innerHTML = "";
    previousCities = JSON.parse(localStorage.getItem("cities"));
    if (!previousCities) {
        previousCities = [];
    }
    for (i = 0; i < previousCities.length && i < 8; i++) {
        var previousLineItem = document.createElement("li");
        previousLineItem.textContent = previousCities[i];
        previousLineItem.classList = "list-group-item";
        previousLineItem.style = "cursor: pointer; text-transform: capitalize";
        previousCitiesEl.appendChild(previousLineItem);
    }
}
//handles clicks on previous searches
$("#previousCities").on("click", ".list-group-item", function () {
    getWeather(this.textContent);
});

showPrevious();
getWeather(city);
cityFormEl.addEventListener("submit", citySubmitHandler);