// MAIN VARIABLES
var searchFormEl = document.querySelector('#search-form');
var previousSearchesEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city-input');
var resultsContainerEl = document.querySelector('#results');

// LOAD CITIES THAT WERE ALREADY SEARCHED  
var loadCities = function () {
    var lastSearch = localStorage.getItem('last-search');
    if (lastSearch) {
        var citiesArray = localStorage.getItem('citiesArray');
        if (citiesArray) {
            citiesArray = JSON.parse(citiesArray);
            var existingButton;
            for (var i = 0; i < citiesArray.length; i++) {
                if (citiesArray[i] === lastSearch) {
                    existingButton = citiesArray[i];
                    break;
                }
            }
            if (!existingButton) {
                citiesArray.push(lastSearch)
            }
        } else {
            citiesArray = [];
            citiesArray.push(lastSearch)
        }
        localStorage.setItem('citiesArray', JSON.stringify(citiesArray));
        previousSearchesEl.textContent = '';
        for (var i = 0; i < citiesArray.length; i++) {
            var cityBtn = document.createElement('button');
            cityBtn.textContent = citiesArray[i];
            cityBtn.classList = 'btn previous-search';

            previousSearchesEl.appendChild(cityBtn);
        }
    }
}

// ADD NEW SEARCH TO LIST OF PREVIOUS SEARCHES
var formSubmitHandler = function (event) {
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if (city) {
        getLatLon(city);
        cityInputEl.value = '';
    }
    else {
        alert('Please enter the name of a city');
    }
};

// SHOW A PREVIOUS SEARCH WHEN CLICKED
var buttonClickHandler = function (event) {
    if (event.target.type === 'submit') {
        var city = event.target.textContent;
        getLatLon(city);
        cityInputEl.textContent = '';
    }
}


// LATITUDE AND LONGITUDE
var getLatLon = function (city) {
    var apiKey = "ff8f64c1c4ae73a70e4b2c346addc528";
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=imperial&appid=' + apiKey;
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    localStorage.setItem('last-search', data.name)
                    loadCities();
                    var city = data.name;
                    var lat = data.coord.lat;
                    var lon = data.coord.lon;
                    getWeather(lat, lon, city);
                });
            } else {
                alert('Error: No city Found');
            }
        })
        .catch(function (error) {
            alert('Unable to Connect')
        });
};

// CURRENT WEATHER AND PREDICTED
var getWeather = function (lat, lon, city) {
    var apiKey = 'ff8f64c1c4ae73a70e4b2c346addc528';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=minutely,hourly,alerts&units=imperial&appid=' + apiKey;
    fetch(apiUrl)
        .then(function (response) {
            response.json().then(function (data) {
                var current = data.current;
                var daily = data.daily;
                displayCurrentWeather(current, city)
                displayForecast(daily);
            });
        });
};

// CURRENT WEATHER
var displayCurrentWeather = function (data, city) {
    console.log(data);
    resultsContainerEl.textContent = '';

    var currentWeatherEl = document.createElement('article');
    currentWeatherEl.id = 'current';
    currentWeatherEl.classList = "p-10";

    var h2El = document.createElement('h2');
    h2El.id = 'city-name';
    var today = new Date();

    // DATE
    var date = (today.getMonth() + 1) + '/' +
        today.getDate() + '/' +
        today.getFullYear();
    h2El.textContent = city + ' (' + date + ')  ';

    // WEATHER ICON
    var icon = data.weather[0].icon;
    var imgEl = document.createElement('img')
    imgEl.classList = 'absolute-position';
    imgEl.setAttribute('src', 'http://openweathermap.org/img/w/' + icon + '.png')


    // TEMPERATURE AND HUMIDITY
    var tempEl = document.createElement('p')
    tempEl.innerHTML = 'Temp: ' + data.temp + '<span>&#176;</span>F';
    tempEl.classList = 'p-20-0-10-0';

    var windEl = document.createElement('p')
    windEl.textContent = 'Wind: ' + data.wind_speed + ' MPH';
    windEl.classList = 'p-10-0';

    var humidityEl = document.createElement('p')
    humidityEl.textContent = 'Humidity: ' + data.humidity + '%';
    humidityEl.classList = 'P-10-0';

    var uvIndexEl = document.createElement('p')
    uvIndexEl.innerHTML = "UV Index: <span id='uvi'>" + data.uvi + '</span';
    uvIndexEl.classList = 'p-10-0';

    // CURRENT WEATHER MEASUREMENTS
    currentWeatherEl.appendChild(h2El);
    currentWeatherEl.appendChild(imgEl);
    currentWeatherEl.appendChild(tempEl);
    currentWeatherEl.appendChild(windEl);
    currentWeatherEl.appendChild(humidityEl);
    currentWeatherEl.appendChild(uvIndexEl);
    resultsContainerEl.appendChild(currentWeatherEl);
}

// DISPLAY FORECAST FOR 5 DAYS
var displayForecast = function (data) {
    console.log(data);
    var forecastEl = document.createElement('div');

    var h3El = document.createElement('h3');
    h3El.textContent = '5-Day Forecast';
    h3El.classList = 'p-20-0-10-0';

    var daysContainerEl = document.createElement('div');
    daysContainerEl.classList = 'row space-between'

    for (var i = 1; i < 6; i++) {
        var singleDayEl = document.createElement('article');
        singleDayEl.classList = 'col-5 col-xl-2 p-10 dark-bg mb-20';

        // ADD CURRENT DATE
        var date = new Date(data[i].dt * 1000);
        var fullDate = (date.getMonth() + 1) + '/' +
            date.getDate() + '/' +
            date.getFullYear();
        var h4El = document.createElement('h4');
        h4El.textContent = fullDate;
        h4El.classList = 'white-font';

        var icon = data[i].weather[0].icon;
        var imgEl = document.createElement('img');
        imgEl.setAttribute('src', 'http://openweathermap.org/img/w/' + icon + '.png');

        // TEMPERATURE, WIND, HUMIDITY
        var tempEl = document.createElement('p');
        tempEl.innerHTML = 'Temp: ' + data[i].temp.day + ' <span>&#176;</span>F';
        tempEl.classList = 'p-10-0 white-font lg-font-size';

        var windEl = document.createElement('p')
        windEl.textContent = 'Wind: ' + data[i].wind_speed + ' MPH';
        windEl.classList = 'p-10-0 white-font lg-font-size'

        var humidityEl = document.createElement('p')
        humidityEl.textContent = 'Humidity: ' + data[i].humidity + ' %';
        humidityEl.classList = 'P-10-0 white-font lg-font-size';

        singleDayEl.appendChild(h4El);
        singleDayEl.appendChild(imgEl);
        singleDayEl.appendChild(tempEl);
        singleDayEl.appendChild(windEl);
        singleDayEl.appendChild(humidityEl);

        daysContainerEl.appendChild(singleDayEl);
    }

    // CURRENT WEATHER BOX SECTION
    forecastEl.appendChild(h3El);
    forecastEl.appendChild(daysContainerEl);
    resultsContainerEl.appendChild(forecastEl);
}

loadCities();
searchFormEl.addEventListener('submit', formSubmitHandler);
previousSearchesEl.addEventListener('click', buttonClickHandler);