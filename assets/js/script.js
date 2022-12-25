// create variables
var cities = [];
var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city-input");
var weatherContainerEl = document.querySelector("#weather-container");
var citySearchInputEl = document.querySelector("#city-search-input");
var forecastTitle = document.querySelector("#forecast-title");
var futureFiveContainer = document.querySelector("#future-five-container");
var oldSearchButtonEl = document.querySelector("#old-search-buttons");

// personal api key
var apiKey = "ee22fe9bce9044dc7f7e553848784294";

var formSubmitHandler = function (event) {
    // prevent page from refreshing
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    if (cityName) {
        getCityWeather(cityName);
        getFutureFive(cityName);
        cities.unshift({ cityName });
        cityInputEl.value = "";
    } else {
        alert("Please enter a valid city");
    }
    saveSearch();
    oldSearch(cityName);
}

// save searches to local storage
var saveSearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

// get current city weather
var getCityWeather = function (cityName) {
    var apiKey = "ee22fe9bce9044dc7f7e553848784294"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                displayCurrentWeather(data, cityName);
            });
        });
};

// display current city weather
var displayCurrentWeather = function (weather, searchCity) {

    //clear old content
    weatherContainerEl.textContent = "";
    citySearchInputEl.textContent = searchCity;

    // current date
    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM DD, YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    // current temperature
    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temperature: " + weather.main.temp + " °F";
    temperatureEl.classList = "card-body text-center";

    // current humidty
    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "card-body text-center";

    // current wind speed
    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "card-body text-center";

    // send data to current weather container
    weatherContainerEl.appendChild(temperatureEl);
    weatherContainerEl.appendChild(humidityEl);
    weatherContainerEl.appendChild(windSpeedEl);
};

// get future five day forecast
var getFutureFive = function (cityName) {
    var apiKey = "ee22fe9bce9044dc7f7e553848784294    "
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                console.log(data);
                displayFutureFive(data);
            });
        });
};

// display future five day forecast
var displayFutureFive = function (weather) {
    futureFiveContainer.textContent = ""

    var futureForecast = weather.list;
    for (var i = 5; i < futureForecast.length; i = i + 8) {
        var dailyFutureForecast = futureForecast[i];

        var futureForecastEl = document.createElement("div");
        futureForecastEl.classList = "card bg-primary text-light m-2";

        // date for next five days
        var futureForecastDate = document.createElement("h5")
        futureForecastDate.textContent = moment.unix(dailyFutureForecast.dt).format("MMM DD, YYYY");
        futureForecastDate.classList = "card-header"
        futureForecastEl.appendChild(futureForecastDate);

        // temp for next five days
        var futureForecastTempEl = document.createElement("span");
        futureForecastTempEl.classList = "card-body";
        futureForecastTempEl.textContent = "Temp: " + dailyFutureForecast.main.temp + " °F";

        // humidity for next five days
        var futureForecastHumEl = document.createElement("span");
        futureForecastHumEl.classList = "card-body";
        futureForecastHumEl.textContent = "Humidity: " + dailyFutureForecast.main.humidity + "  %";

        // wind speed for next five days
        var futureForecastWindEl = document.createElement("span");
        futureForecastWindEl.classList = "card-body";
        futureForecastWindEl.textContent = "Wind: " + dailyFutureForecast.wind.speed + "  MPH";

        //send data to future five day container
        futureForecastEl.appendChild(futureForecastTempEl);
        futureForecastEl.appendChild(futureForecastHumEl);
        futureForecastEl.appendChild(futureForecastWindEl);
        futureFiveContainer.appendChild(futureForecastEl);
    }

}

// create new button in search history
var oldSearch = function (oldSearch) {
    oldSearchEl = document.createElement("button");
    oldSearchEl.textContent = oldSearch;
    oldSearchEl.classList = "d-flex w-100 btn-light border p-2";
    oldSearchEl.setAttribute("data-city", oldSearch)
    oldSearchEl.setAttribute("type", "submit");

    oldSearchButtonEl.prepend(oldSearchEl);
}

// event listeners
cityFormEl.addEventListener("submit", formSubmitHandler);
oldSearchButtonEl.addEventListener("click", oldSearchHandler);
