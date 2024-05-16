// NavBar
let cityNameInput = document.getElementById("cityNameInput");
let searchBtn = document.getElementById("searchBtn");
let home = document.getElementById("home");
let hourly = document.getElementById("hourly");

// Home section
let homeSection = document.getElementById("homeSection");
let weatherForecast = document.getElementById("weatherForecast");
let cityName = document.getElementById("cityName");
let currentTemp = cityName.nextElementSibling;
let feelsLike = currentTemp.nextElementSibling;
let weatherCondition = feelsLike.nextElementSibling;
let maxTemp = weatherCondition.nextElementSibling.firstElementChild;
let avgTemp = maxTemp.nextElementSibling;
let lowTemp = avgTemp.nextElementSibling;
let maxHumidity = document.getElementById("humidity").firstElementChild
let avgHumidity = maxHumidity.nextElementSibling;
let lowHumidity = avgHumidity.nextElementSibling;
let coldestTime = homeSection.lastElementChild;
let warmestTime = coldestTime.previousElementSibling;
let arrayOfTemperatures = [];
let arrayOfHumidity = [];

// Hourly section
let hourlySection = document.getElementById("hourlySection");
let table = hourlySection.lastElementChild;
let tableBody = table.lastElementChild;

let clearResults = () => {
    cityName.innerHTML = "";
    currentTemp.innerHTML = "";
    feelsLike.innerHTML = "";
    weatherCondition.innerHTML = "";
    maxTemp.innerHTML = "";
    avgTemp.innerHTML = "";
    lowTemp.innerHTML = "";
    maxHumidity.innerHTML = "";
    avgHumidity.innerHTML = "";
    lowHumidity.innerHTML = "";
    coldestTime.innerHTML = "";
    warmestTime.innerHTML = "";
    arrayOfTemperatures = [];
    arrayOfHumidity = [];
    tableBody.innerHTML = "";
}


// Api request
function getWeatherInfo() {
    let weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityNameInput.value}&units=metric&APPID=2095b65c75e8d13fe9e3b0e095b36936`;
    $.ajax({
        url: weatherUrl,
        method: "GET",
        success: function (response) {
            console.log(response);
            printHome(response);
            printHourly(response.list);
        },

        error: function (error) {
            console.log(error)
            alert("You have entered an invalid City Name! Please try again.")
        }
    })
    clearResults(); // Clearing the results after every request
}

searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    if (cityNameInput.value === "") {
        alert("You have not enter a city yet!") // validation
    } else {
        getWeatherInfo();
        homeSection.style.display = "block" // Seting the Home section to be displayed first
        hourlySection.style.display = "none";
    }
});

home.addEventListener("click", () => {
    if (cityNameInput.value === "") {
        homeSection.style.display = "none"; // validation if the home section is clicked before entering a city name
        alert("You have not enter a city yet!")
    } else {
        weatherForecast.style.display = "block";
        homeSection.style.display = "block"; // when home is clicked, display home and hide hourly
        hourlySection.style.display = "none";
    }
});

hourly.addEventListener("click", () => {
    if (cityNameInput.value === "") {
        hourlySection.style.display = "none"; // validation if the hourly section is clicked before entering a city name
        alert("You have not enter a city yet!")
    } else {
        weatherForecast.style.display = "none";
        homeSection.style.display = "none"; // when hourly is clicked, display hourly and hide home
        hourlySection.style.display = "flex";
    }
})

function printHome(response) {
    weatherForecast.innerHTML = "Weather Forecast"
    cityName.innerHTML = `City Name: ${response.city.name}`;
    currentTemp.innerHTML = `Current temperature: ${parseInt(response.list[0].main.temp)}°C`;
    feelsLike.innerHTML = `Feels like: ${parseInt(response.list[0].main.feels_like)}°C`;
    weatherCondition.innerHTML = `${response.list[0].weather[0].main}: 
    <img src=" http://openweathermap.org/img/w/${response.list[0].weather[0].icon}.png">`;
    minMaxAvgTempAndHumidity(response.list);
}

// a function for calculating the Min, max and low temperature/humidity and warmest and coldest time
let minMaxAvgTempAndHumidity = (array) => {
    let highestTemp = array[0]
    let lowestTemp = array[0]
    for (let iterator of array) {

        arrayOfTemperatures.push(parseInt(iterator.main.temp));
        arrayOfHumidity.push(iterator.main.humidity);

        if (highestTemp.main.temp < iterator.main.temp) {
            highestTemp = iterator;
        }
        if (lowestTemp.main.temp > iterator.main.temp) {
            lowestTemp = iterator
        }
    }
    maxTemp.innerHTML = `Max temp: ${Math.max(...arrayOfTemperatures)}°C `;
    lowTemp.innerHTML = `Low temp: ${Math.min(...arrayOfTemperatures)}°C `;
    avgTemp.innerHTML = `Avg temp: ${parseInt(arrayOfTemperatures.reduce((a, b) => a + b, 0) / arrayOfTemperatures.length)}°C `

    maxHumidity.innerHTML = `Max humidity: ${Math.max(...arrayOfHumidity)}%`;
    lowHumidity.innerHTML = `Low humidity: ${Math.min(...arrayOfHumidity)}%`;
    avgHumidity.innerHTML = `Avg humidity: ${parseInt(arrayOfHumidity.reduce((a, b) => a + b, 0) / arrayOfHumidity.length)}%`;

    warmestTime.innerHTML = `Warmest time of the period: ${new Date(highestTemp.dt * 1000).toDateString()}`;
    coldestTime.innerHTML = `Coldest time of the period: ${new Date(lowestTemp.dt * 1000).toDateString()}`;
}

let printHourly = (resultArray) => {
    for (let hourlyInfo of resultArray) {
        let row = document.createElement("tr");
        row.innerHTML += `
        <td><img src=" http://openweathermap.org/img/w/${hourlyInfo.weather[0].icon}.png"></td>
        <td>${hourlyInfo.weather[0].description}</td>
        <td>${hourlyInfo.dt_txt}</td>
        <td>${parseInt(hourlyInfo.main.temp)}°C</td> 
        <td>${hourlyInfo.main.humidity}%</td>
        <td>${hourlyInfo.wind.speed.toFixed(1)} km/h</td>
        `
        tableBody.appendChild(row);
    }
}


