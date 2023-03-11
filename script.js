const gpsButton = document.querySelector(".gps-btn");
const yourWeatherButton = document.querySelector(".your-weather__action");
const yourWeatherEle = document.querySelector(".your-weather");
const searchInput = document.querySelector(".search-input");
const searchButton = document.querySelector(".search-btn");
const loadingPageEle = document.querySelector(".page-loading");
const statuss = document.querySelector(".status");
const weatherDetailsEle = document.querySelector(".render-weather");

const cityNameEle = document.querySelector(".city-name");
const countryIconEle = document.querySelector(".country-icon");
const weatherDescEle = document.querySelector(".weather-description");
const weatherIconEle = document.querySelector(".weather-description-img");
const tempEle = document.querySelector(".temparature");
const windspeedEle = document.querySelector(".wind-speed-value");
const humidityEle = document.querySelector(".humidity-value");
const cloudinessEle = document.querySelector(".cloudiness-value");



const searchWeatherOfCityEle = document.querySelector(".search-weather__action");
const searchCityDivEle = document.querySelector(".search-input-div");
const searchCityInputEle = document.querySelector(".search-input");

const errorPageEle = document.querySelector(".error-page");
const searchBtnEle = document.querySelector(".search-btn");



const API_KEY = "b472fbdc831c9ebf43fbeb091b6a68b2";



async function render(weatherDetails) {
    if (!!weatherDetails?.name) {
        console.log("sadak");
        loadingPageEle.classList.remove("active");
        weatherDetailsEle.classList.add("active");
        errorPageEle.classList.remove("active");
        cityNameEle.innerText = weatherDetails?.name;
        countryIconEle.src = `https://flagcdn.com/144x108/${weatherDetails?.sys?.country.toLowerCase()}.png`;
        weatherDescEle.innerText = weatherDetails?.weather?.[0]?.description;
        weatherIconEle.src = `http://openweathermap.org/img/w/${weatherDetails?.weather?.[0]?.icon}.png`;
        tempEle.innerText = `${weatherDetails?.main?.temp} °C`;
        windspeedEle.innerText = `${weatherDetails?.wind?.speed} m/s`;
        humidityEle.innerText = `${weatherDetails?.main?.humidity} %`;
        cloudinessEle.innerText = `${weatherDetails?.clouds?.all} %`;
    } else {
        yourWeatherButton.classList.remove("active");
        searchWeatherOfCityEle.classList.remove("active");
        loadingPageEle.classList.remove("active");
        yourWeatherEle.classList.remove("active");
        weatherDetailsEle.classList.remove("active");
        errorPageEle.classList.add("active");
        searchCityDivEle.classList.remove("active");
    }
}

async function fetchWeatherDataFromGPSValues(userCoordinates) {
    try {
        let weatherDetails;
        const {latitude, longitude} = userCoordinates;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
        console.log(url);
        weatherDetails = await fetch(url);
        weatherDetails = await weatherDetails.json(); 
        render(weatherDetails);
    } catch(error) {
        statuss.innerText = "Please Try Again";
    }
};

const callBackForGPSValues = (coordinatesObj) => {
    const userCoordinates = {
        latitude: coordinatesObj.coords.latitude,
        longitude: coordinatesObj.coords.longitude,
    }
    sessionStorage.setItem(
        "user-coordinates", 
        JSON.stringify(userCoordinates)
    );
    const weatherDetails = fetchWeatherDataFromGPSValues(userCoordinates);
    
};

const renderUserWeatherAtStart = () => {
    let userCoordinates = sessionStorage.getItem("user-coordinates");
    userCoordinates = JSON.parse(userCoordinates);
    if (!userCoordinates) {
        loadingPageEle.classList.remove("active");
        errorPageEle.classList.remove("active");
        yourWeatherEle.classList.add("active");
    } else {
        const weatherDetails = fetchWeatherDataFromGPSValues(userCoordinates);
    }
};

renderUserWeatherAtStart();

gpsButton.addEventListener("click", () => {
    yourWeatherEle.classList.remove("active");
    errorPageEle.classList.remove("active");
    loadingPageEle.classList.add("active");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(callBackForGPSValues);
    } else {
        statuss.innerText = "Your System don't support this request...";
    }
});



searchWeatherOfCityEle.addEventListener("click", () => {
    searchWeatherOfCityEle.classList.add("active");
    yourWeatherButton.classList.remove("active");
    loadingPageEle.classList.remove("active");
    yourWeatherEle.classList.remove("active");
    weatherDetailsEle.classList.remove("active");
    errorPageEle.classList.remove("active");
    searchCityDivEle.classList.add("active");
})

async function fetchWeatherDataFromCityName(city) {
    try {
        let weatherDetails;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
        console.log(url);
        weatherDetails = await fetch(url);
        weatherDetails = await weatherDetails.json(); 
        render(weatherDetails);
    } catch(error) {
        statuss.innerText = "Please Try Again";
    }
};

searchBtnEle.addEventListener("click", (event) => {
    event.preventDefault();
    fetchWeatherDataFromCityName(searchCityInputEle.value);
    searchCityInputEle.value = "";
});


yourWeatherButton.addEventListener("click", () => {
    errorPageEle.classList.remove("active");
    yourWeatherButton.classList.add("active");
    searchWeatherOfCityEle.classList.remove("active");
    loadingPageEle.classList.remove("active");
    yourWeatherEle.classList.remove("active");
    weatherDetailsEle.classList.remove("active");
    searchCityDivEle.classList.remove("active");
    renderUserWeatherAtStart();
})


