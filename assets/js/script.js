var apiKey = "411165753b54ef779d0c21d853c22321";
var city = "san francisco";
var previousCities = [];
var previousCitiesEl = document.querySelector("#previousCities");
//search elements
var cityInputEl = document.querySelector("#citySearch");
var cityFormEl = document.querySelector("#cityForm");
//todays weather elements
var todaysCityEl = document.querySelector("#cityName");
var todaysDateEl = document.querySelector("#cityDate");
var todayTempEl = document.querySelector("#todayTemp");
var todayHumiEl = document.querySelector("#todayHumi");
var todayWindEl = document.querySelector("#todayWind");
var todayUvEl = document.querySelector("#todayUv");
//5-day forecast elements
var fiveDayEl = document.querySelector("#fiveDay");

var citySubmitHandler = function (event) {

    event.preventDefault();

    var citySearch = cityInputEl.value.trim();

    if (citySearch) {
        getWeather(citySearch);
        cityInputEl.value = "";
        previousCities.push(citySearch);
        localStorage.setItem("cities", JSON.stringify(previousCities));
        showPrevious();
    } else {
        alert("Please enter a city");
    }
};

var getWeather = function (city) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    showWeather(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to get weather");
        });
};

var showWeather = function (data) {
    var lat = data.coord.lat;
    var lon = data.coord.lon;

    todaysCityEl.textContent = data.name;
    todaysDateEl.textContent = moment(data.dt * 1000).format("[  ](M/DD/YYYY)");
    todayTempEl.textContent = Math.floor(data.main.temp) + "ºF";
    todayHumiEl.textContent = Math.floor(data.main.humidity) + "%";
    todayWindEl.textContent = data.wind.speed + " MPH"

    var fiveDayApi = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + apiKey;
    fetch(fiveDayApi)
        .then(function (response) {

            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    fiveDayForecast(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to get weather");
        });
};

//handles 5-day forecast and uv index for current days weather.
var fiveDayForecast = function (data) {
    //uv index handling
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

        var dailyForecast = document.createElement("div");
        dailyForecast.classList = "card bg-primary text-white m-2 col-2";

        var dailyForecastDate = document.createElement("div");
        dailyForecastDate.classList = "card-header";
        dailyForecastDate.textContent = moment(data.daily[i].dt * 1000).format("[ ]M/DD/YYYY");
        dailyForecast.appendChild(dailyForecastDate);

        var dailyWeatherPng = document.createElement("img");
        dailyWeatherPng.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        dailyWeatherPng.classList = "bg-white mb-2"
        dailyForecast.appendChild(dailyWeatherPng);

        var dailyTemp = document.createElement("p");
        dailyTemp.textContent = "Temp: " + Math.floor(data.daily[i].temp.day) + "ºF";
        dailyForecast.appendChild(dailyTemp);

        var dailyHumi = document.createElement("p");
        dailyHumi.textContent = "Humidity: " + Math.floor(data.daily[i].humidity) + "%";
        dailyForecast.appendChild(dailyHumi);

        fiveDayEl.appendChild(dailyForecast);
    }
}

var showPrevious = function(){
    previousCitiesEl.innerHTML = "";
    previousCities = JSON.parse(localStorage.getItem("cities"));
    if (!previousCities) {
        previousCities = [];
    }
    for (i=0; i < previousCities.length; i++){
        var previousLineItem = document.createElement("li");
        previousLineItem.textContent = previousCities[i];
        previousLineItem.classList = "list-group-item";
        previousLineItem.style = "cursor: pointer";
        previousCitiesEl.appendChild(previousLineItem);
    }
}

$("#previousCities").on("click",".list-group-item",function(){
    getWeather(this.textContent);
});

showPrevious();
getWeather(city);
cityFormEl.addEventListener("submit", citySubmitHandler);
