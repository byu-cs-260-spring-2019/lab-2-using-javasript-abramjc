// Day of the Week Array
day_of_week = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// Takes the name of a city, return json object from openweathermap api call
async function getCurrentCityWeather(value) {
    const url = "http://api.openweathermap.org/data/2.5/weather?q=" + value + ",US&units=imperial" + "&APPID=c924bc068a5e2c83b7ee180a8d012386";
    try {

        let response = await fetch(url); 
        let json = await response.json();

        return json;
    }
    catch(err) {
        console.log(err);
    }
}

async function getCurrentZipWeather(zipCode) {
    const url = "http://api.openweathermap.org/data/2.5/weather?zip=" + zipCode + ",US&units=imperial" + "&APPID=c924bc068a5e2c83b7ee180a8d012386";
    try {

        let response = await fetch(url); 
        let json = await response.json();

        return json;
    }
    catch(err) {
        console.log(err);
    }
}

async function getCityFiveDayForecast(city) {
    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&APPID=c924bc068a5e2c83b7ee180a8d012386";
    try {

        let response = await fetch(url); 
        let json = await response.json();

        return json;
    }
    catch(err) {
        console.log(err);
    }
}

function standardizeString(string) {
    let tmp = string.toLowerCase();
    return tmp.charAt(0).toUpperCase() + tmp.slice(1);
}


function TwelveHourTime(date_obj) {
    let hour = date_obj.getHours();
    let minute = date_obj.getMinutes();
    let am_pm = (hour > 11) ? "pm" : "am";
    if(hour > 12) {
        hour -= 12;
    } 
    else if(hour == 0) {
        hour = "12";
    }
    if(minute < 10) {
        minute = "0" + minute;
    }
    return hour + ":" + minute + am_pm;
}

async function setCurrentWeather(city) {
    let json_response = await getCurrentCityWeather(city);

    console.log(json_response);
    console.log(json_response.weather);
    
    let title = standardizeString((json_response.weather)[0].main);
    let description = standardizeString(json_response.weather[0].description);
    let icon_url = 'http://openweathermap.org/img/w/' + json_response.weather[0].icon + '.png';

    document.getElementById("current-weather").innerHTML = 
        '<h3 class="card-title">Currently in ' + json_response.name + '</h3>' +
        '<div id="top-right-col" class="current-weather-card" >' +
        '    <p class="card-title">' + json_response.main.temp + '&degF</p>' +
        '    <img class="weather-icon" src="' + icon_url + '" alt="weather.png">' +
        '    <p class="card-body">' + description + '</p>' +
        '</div>';



}

async function setFiveDayForecast(city) {
    json_response = await getCityFiveDayForecast(city);
    console.log(json_response);

    let forecast_body = '<div class="col"> <div class="weather-card">'; 
    let prev_date = new Date();
    prev_date.setTime(json_response.list[0].dt * 1000);

    forecast_body += "<h5>" + day_of_week[prev_date.getDay()] + "</h5>";

    for (var i = 0; i < json_response.list.length; i++) {
        let curr_date = new Date();
        curr_date.setTime(json_response.list[i].dt * 1000);

        if (prev_date.getDay() < curr_date.getDay()) {
            forecast_body += '</div></div>' + '<div class="col"> <div class="weather-card">';
            forecast_body += '<h5 class="timestamp">' + day_of_week[curr_date.getDay()] + '</h5>';
        }

//        forecast_body += "<br>";
        forecast_body += '<p class="timestamp">' + TwelveHourTime(curr_date) + '</p>';
        forecast_body += '<img class="weather-icon" src="http://openweathermap.org/img/w/' + json_response.list[i].weather[0].icon + '.png">'
        forecast_body += '<p class="card-body">' + standardizeString(json_response.list[i].weather[0].description) + '</p>'
        forecast_body += '<hr>';


        prev_date.setTime(curr_date.getTime());
    }
    forecast_body += '</div></div>';

    document.getElementById("five-day-forecast").innerHTML = forecast_body;


}

window.onload = function() {
    document.getElementById("weatherSubmit").addEventListener("click", async function(event) {
        event.preventDefault();
        const value = document.getElementById("weatherInput").value;

        setCurrentWeather(value);

        let forecast_title = document.getElementById("forecast-title");
        forecast_title.innerHTML = "Five Day Forecast for " + standardizeString(value);
        forecast_title.style.display = "block";

        setFiveDayForecast(value);
    });

};
