// Variables
var input = document.querySelector('#search-input');
var form = document.querySelector('#search-form');
var history = [];
var searchHistory = document.querySelector('#history');
var url = 'https://api.openweathermap.org';
var forcast = document.querySelector('#forecast');
var key = 'd91f911bcf2c0f925fb6535547a5ddc9';

//Adding Plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function currentWeather(city, weather, timezone) {
    var date = dayjs().tz(timezone).format('M/D/YYYY');

    var temperature = weather.temp;
    var uvi = weather.uvi;
    var mph = weather.wind_speed;
    var humid = weather.humidity;
    var description = weather.weather[0].description || weather[0].main;
    var iUrl = 'https://openweathermap.org/img/w/${weather.weather[0].icon}.png'
}