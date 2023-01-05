// Variables
var input = document.querySelector('#search-input');
var form = document.querySelector('#search-form');
var history = [];
var searchHistory = document.querySelector('#history');
var url = 'https://api.openweathermap.org';
var forcast = document.querySelector('#forecast');
var key = 'd91f911bcf2c0f925fb6535547a5ddc9';
var today = document.querySelector('#today');

//Adding Plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function currentWeather(city, weather, timezone) {
    var date = dayjs().tz(timezone).format('M/D/YYYY');
    
    //Variables for API data
    var temperature = weather.temp;
    var uvi = weather.uvi;
    var mph = weather.wind_speed;
    var humid = weather.humidity;
    var description = weather.weather[0].description || weather[0].main;
    var iUrl = 'https://openweathermap.org/img/w/${weather.weather[0].icon}.png'
    var wIcon = document.createElement('img');
    var header = document.createElement('h2');
    var humEl = document.createElement('p');
    var badge = document.createElement('button');
    var uv = document.createElement('p');
    var wind = document.createElement('p');
    var card = document.createElement('div');
    var tempElement = document.createElement('p');
    var body = document.createElement('div');

    //Setting attributes for data variables
    header.setAttribute('class', 'h3 card-title');
    wind.setAttribute('class', 'card-text');
    humEl.setAttribute('class', 'card-text');
    tempElement.setAttribute('class', 'card-text');

    tempElement.textContent = `Temp: ${temperature}°F`;
    humEl.textContent = `Humidity: ${humid} %`;
    wind.textContent = `Wind: ${mph} MPH`;
    body.append(header, tempElement, wind, humEl);

    header.textContent = `${city} (${date})`;
    wIcon.setAttribute('class', 'weather-img');
    wIcon.setAttribute('src', iUrl);
    wIcon.setAttribute('alt', description);
    header.append(wIcon);

    //Append the card to the body
    card.setAttribute('class', 'card');
    body.setAttribute('class', 'card-body');
    card.append(body);

    uv.textContent = 'UV Index: ';
    badge.classList.add('btn', 'btn');

    if (uvi < 3) {
        badge.classList.add('btn-success');
    } else if (uvi < 7) {
        badge.classList.add('btn-warning');
    } else {
        badge.classList.add('btn-danger');
    }

    today.innerHTML = '';
    today.append(card);

    badge.textContent = uvi;
    uv.append(badge);
    body.append(uv);
};