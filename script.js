// Variables
var input = document.querySelector("#search-input");
var form = document.querySelector("#search-form");
var history = [];
var searchHistory = document.querySelector("#history");
var weatherAPIURL = "https://api.openweathermap.org";
var forecast = document.querySelector("#forecast");
var key = "d91f911bcf2c0f925fb6535547a5ddc9";
var today = document.querySelector("#today");

//Adding Plugins
dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function currentWeather(city, weather, timezone) {
  var date = dayjs().tz(timezone).format("M/D/YYYY");
    console.log(weather.temp)
  //Variables for API data
  var temperature = weather.temp;
  var uvi = weather.uvi;
  var mph = weather.wind_speed;
  var humid = weather.humidity;
  var description = weather.weather[0].description || weather[0].main;
  var iUrl = `https://openweathermap.org/img/w/${weather.weather[0].icon}.png`;
  var wIcon = document.createElement("img");
  var header = document.createElement("h2");
  var humEl = document.createElement("p");
  var badge = document.createElement("button");
  var uv = document.createElement("p");
  var wind = document.createElement("p");
  var card = document.createElement("div");
  var tempElement = document.createElement("p");
  var body = document.createElement("div");

  //Setting attributes for data variables
  header.setAttribute("class", "h3 card-title");
  wind.setAttribute("class", "card-text");
  humEl.setAttribute("class", "card-text");
  tempElement.setAttribute("class", "card-text");

  tempElement.textContent = `Temp: ${temperature}°F`;
  humEl.textContent = `Humidity: ${humid} %`;
  wind.textContent = `Wind: ${mph} MPH`;
  body.append(header, tempElement, wind, humEl);

  header.textContent = `${city} (${date})`;
  wIcon.setAttribute("class", "weather-img");
  wIcon.setAttribute("src", iUrl);
  wIcon.setAttribute("alt", description);
  header.append(wIcon);

  //Append the card to the body
  card.setAttribute("class", "card");
  body.setAttribute("class", "card-body");
  card.append(body);

  uv.textContent = "UV Index: ";
  badge.classList.add("btn", "btn");

  if (uvi < 3) {
    badge.classList.add("btn-success");
  } else if (uvi < 7) {
    badge.classList.add("btn-warning");
  } else {
    badge.classList.add("btn-danger");
  }

  today.innerHTML = "";
  today.append(card);

  badge.textContent = uvi;
  uv.append(badge);
  body.append(uv);
}

//Function to render information from button
function render() {
  searchHistory.innerHTML = "";

  for (var i = history.length - 1; i >= 0; i--) {
    var btn = document.createElement("button");
    btn.setAttribute("aria-controls", "today forecast");
    btn.setAttribute("type", "button");
    btn.classList.add("history-btn", "btn-history");
    btn.setAttribute("data-search", history[i]);
    btn.textContent = history[i];
    searchHistory.append(btn);
  }
}

// Function to initialize the render function
function init() {
  var cache = localStorage.getItem("#search-history");
  if (cache) {
    history = JSON.parse(cache);
  }
  render();
}

function appendHist(search) {
  var history = [];
  if (history.indexOf(search) !== -1) {
    return;
  }
  history.push(search);

  localStorage.setItem("search-history", JSON.stringify(history));
  render();
}

function dataRender(city, data) {
  currentWeather(city, data.current, data.timezone);
  forecast(data.daily, data.timezone);
}

function forecastCard(forecast, timezone) {
  //All Variabes for this function scope
  var iUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
  var iDesc = forecast.weather[0].description;
  var { humid } = forecast;
  var mph = forecast.wind_speed;
  var temperature = forecast.temp.day;
  var unixTs = forecast.dt;
  var body = document.createElement("div");
  var title = document.createElement("h5");
  var humEl = document.createElement("p");
  var wind = document.createElement("p");
  var tempElement = document.createElement("p");
  var card = document.createElement("div");
  var col = document.createElement("div");
  var icon = document.createElement("img");

  col.append(card);
  card.append(body);
  body.append(title, icon, tempElement, wind, humEl);

  tempElement.setAttribute("class", "card-text");
  wind.setAttribute("class", "card-text");
  title.setAttribute("class", "card-title");
  card.setAttribute("class", "card bg primary h-100 text-white");
  body.setAttribute("class", "card-body p-2");
  humEl.setAttribute("class", "card-text");
  col.setAttribute("class", "col-md");
  col.classList.add("five-day-card");

  humEl.textContent = `Humidity: ${humid} %`;
  wind.textContent = `Wind: ${mph} MPH`;
  tempElement.textContent = `Temp: ${temperature} °F`;
  title.textContent = dayjs.unix(unixTs).tz(timezone).format("M/D/YYYY");
  icon.setAttribute("src", iUrl);
  icon.setAttribute("alt", iDesc);

  forecast.append(col);
}

// Function to get the forecast of a certain location
function forecast(dailyForecast, timezone) {
  var start = dayjs().tz(timezone).add(1, "day").startOf("day").unix();
  var end = dayjs().tz(timezone).add(6, "day").startOf("day").unix();
  var header = document.createElement("h4");
  var heading = document.createElement("div");

  header.textContent = "5-Day Forecast";
  heading.setAttribute("class", "col-12");
  heading.append(heading);

  forecast.innerHTML = "";
  forecast.append(heading);
  for (var i = 0; i < dailyForecast.length; i++) {
    if (dailyForecast[i].dt >= start && dailyForecast[i].dt < end) {
      forecastCard(dailyForecast[i], timezone);
    }
  }
}

//Function to get the weather for a location
function weather(location) {
  var { lon } = location;
  var { lat } = location;
  var city = location.name;
  var forecasturl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly&appid=${key}`;

  fetch(forecasturl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      dataRender(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function coordinates(search) {
  var forecasturl = `https://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=5&appid=${key}`;

  fetch(forecasturl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("Location not found");
      } else {
        appendHist(search);
        weather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

function click(e) {
  if (!e.target.matches(".btn-history")) {
    return;
  }
  var btn = e.target;
  var search = btn.getAttribute("data-search");
  coordinates(search);
}

//Form for submission
function submit(e) {
  if (!input.value) {
    return;
  }
  e.preventDefault();
  var search = input.value.trim();
  coordinates(search);
  input.value = "";
}

init();
searchHistory.addEventListener("click", click);
form.addEventListener("submit", submit);
