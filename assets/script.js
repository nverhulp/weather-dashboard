// VARIABLES
var searchFormEl = document.querySelector('#search-form');
var previousSearchesEl = document.querySelector('#city-boxes');
var cityInputEl = document.querySelector('#city-input');
var resultsContainerEl = document.querySelector('#results');

// FUNCTIONS

// USER REVISITING BROWSER
var loadCities = function() {
    var lastSearch = localStorage.getItem('last-search');
    if(lastSearch) {
        var citiesArray = localStorage.getItem('citiesArray');
        if(citiesArray) {
            citiesArray = JSON.parse(citiesArray);
            var exisitingButton;
            for(var i = 0; i < citiesArray.length; i++) {
                if(citiesArray[i] === lastSearch) {
                    exisitingButton = citiesArray[i];
                    break;
                }
            }
            if(!exisitingButton) {
                citiesArray.push(lastSearch)
            }
        // CREATE ARRAY IF IT DOESN'T ALREADY EXIST IN STORAGE
        } else {
            citiesArray = [];
            citiesArray.push(lastSearch)
        }
        localStorage.setItem('citiesArray', JSON.stringify(citiesArray));
        previousSearchesEl.textContent = '';
        // CREATE NEW CITY BUTTONS/BOXES
        for(var i = 0; i < citiesArray.length; i++) {
            var cityBtn = document.createElement('button');
            cityBtn.textContent = citiesArray [i];
            cityBtn.classList = 'btn previous-search';
            previousSearchesEl.appendChild(cityBtn);
        }
    }
}

// SEARCH FOR NEW CITY
var formSubmitHandler = function(event) {
    event.preventDefault();
    var city = cityInputEl.ariaValueMax.trim();
    if(city) {
        getLatLon(city);
        cityInputEl.value = '';
    } else {
        alert("You must enter a city name");
    }
};

// OLD SEARCH RECLICKED
var buttonClickHandler = function(event) {
    if(event.target.type === 'submit') {
        var city = event.target.textContent;
        getLatLon(city);
        cityInputEl.textContent = '';
    }
}

// LATITUDE AND LONGITUDE
var getLatLon = function(city) {
    var apiKey = "3cc63ff09703a0958e90f4724b969776";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&unites=imperial*appid=" + apiKey;
    fetch(apiUrl)
    .then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                localStorage.setItem('last-search', data.name)
                loadCities();
                var city = data.name;
                var lat = data.coord.lat;
                var lon = data.coord.lon;
                getWeather(lat, lon, city);
            });
        } else {
            alert("Error: No city was found");
        }
    }).catch(function(error) {
        alert("Unable to connect")
    });
};

// CURRENT DAY WEATHER AND 5 DAY FORECAST
var getWeather = function(lat, lon, city) {
    var apiKey = "3cc63ff09703a0958e90f4724b969776";
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + apiKey;
    fetch(apiUrl) 
    .then(function(response) {
        response.json().then(function(data) {
            var current = data.current;
            var daily = data.daily;
            displayCurrentWeather(current, city);
            displayForecast(daily);
        });
    });
};

var displayCurrentWeather = function(data, city) {
    console.log(data);

    // CLEAR RESULTS
    resultsContainerEl.textContent = '';

    // NEW WEATHER CONTAINER/BOX
    var currentWeatherEl = document.createElement('article');
    currentWeatherEl.id = 'current';
    currentWeatherEl.classList = "p-10";

    // HEADER
    var headerEl = document.createElement('header');
    headerEl.id = 'city-name';
    var today = new Date();
    var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
    headerEl.textContent = city + ' (' + date + ') ';

    // ICON
    var icon = data.weather[0].icon;
    var imgEl = document.createElement('img');
    imgEl.classList = 'absolute-position';
    imgEl.setAttribute('src', 'http://openweathermap.org/img/w/' + icon + '.png');

    // TEMPERATURE
    var tempEl = document.createElement('p');
    tempEl.innerHTML = 'Temp: ' + data.temp + '<span>&#176;</span>F';
    tempEl.classList = 'p-20-0-10-0';

    // WIND
    var windEl = document.createElement('p');
    windEl.textContent = 'Wind: ' + data.wind_speed + 'MPH';
    windEl.classList = 'p-10-0';

    // HUMIDITY
    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + data.humidityEl + '%';
    humidityEl.classList = 'p-10-0';

    // UV INDEX
    var uvIndexEl = document.createElement('p');
    uvIndexEl.innerHTML = "UV Index: <span id='uvi'>" + data.uvi + '</span>';
    uvIndexEl.classList = 'p-10-0';

    // HAVE DATA DISPLAY IN CORRECT SPOT
    currentWeatherEl.appendChild(headerEl);
    currentWeatherEl.appendChild(imgEl);
    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(windEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(uvIndexEl);
    resultsContainerEl.appendChild(currentWeatherEl);
}

