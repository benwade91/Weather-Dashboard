var apiKey = "411165753b54ef779d0c21d853c22321";
var city = "san+francisco";

var cityInputEl = document.querySelector("#citySearch");
var cityFormEl = document.querySelector("#cityForm");
var todaysCityEl = document.querySelector("#cityName");
var todaysDateEl = document.querySelector("#cityDate");
var todayTempEl = document.querySelector("#todayTemp");
var todayHumiEl = document.querySelector("#todayHumi");
var todayWindEl = document.querySelector("#todayWind");
var todayUvEl = document.querySelector("#todayUv");

var citySubmitHandler = function (event) {

    event.preventDefault();

    var city = cityInputEl.value.trim();

    if (city) {
        console.log(city);
        cityInputEl.value = "";
    } else {
        alert("Please enter a city");
    }
};

var getWeather = function (city) {

    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
        .then(function (response) {

            if (response.ok) {
                console.log(response);
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

var showWeather = function(data){
    var lat = data.coord.lat;
    var lon = data.coord.lon;

    todaysCityEl.textContent = data.name;
    todaysDateEl.textContent = moment().format("[ ]MMM Do YYYY");
    todayTempEl.textContent = Math.floor(data.main.temp) + "ºF";
    todayHumiEl.textContent = Math.floor(data.main.humidity) + "%";
    todayWindEl.textContent = data.wind.speed + " MPH"
    
    var fiveDayApi = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+apiKey;
    fetch(fiveDayApi)
    .then(function (response) {

        if (response.ok) {
            console.log(response);
            response.json().then(function (data) {
                console.log(data);
                // showWeather(data);
            });
        } else {
            alert("Error: " + response.statusText);
        }
    })
    .catch(function (error) {
        alert("Unable to get weather");
    });
};

var fiveDayForecast = function(data){}

getWeather(city);
cityFormEl.addEventListener("submit", citySubmitHandler);