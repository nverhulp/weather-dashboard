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