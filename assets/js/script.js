var apiKey = "411165753b54ef779d0c21d853c22321";
var city = "london";

var cityInputEl = document.querySelector("#citySearch");
var cityFormEl = document.querySelector("#cityForm");

var citySubmitHandler = function(event) {
    
    event.preventDefault();
  
    var city = cityInputEl.value.trim();
  
    if (city) {
      console.log(city);
      cityInputEl.value = "";
    } else {
      alert("Please enter a city");
    }
  };

var getWeather = function(city) {
    
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=" + apiKey;

    fetch(apiUrl)
      .then(function(response) {
          
        if (response.ok) {
          console.log(response);
          response.json().then(function(data) {
            console.log(data.list[0]);
          });
        } else {
          alert("Error: " + response.statusText);
        }
      })
      .catch(function(error) {
        alert("Unable to get weather");
      });
  };
  getWeather(city);
  cityFormEl.addEventListener("submit", citySubmitHandler);