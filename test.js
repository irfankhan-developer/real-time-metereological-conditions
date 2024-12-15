const cityInput = document.querySelector('.city-input');
const searchBtn = document.querySelector('.search-btn');
const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')
const cityText = document.querySelector('.city-txt')
const tempText = document.querySelector('.temp-txt')
const conditionText  = document.querySelector('.condition-text')
const humidityValueText = document.querySelector('.humidity-value-txt')
const windValueText = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateText = document.querySelector('.current-date-txt')
const foreCastItemsContainer =document.querySelector('.forecast-items-container')
const apiKey = '25264983150c5ae492808398dd919ab6'
searchBtn.addEventListener('click', ()=>{
    if(cityInput.value.trim() !=""){
        updateWeatherInfo(cityInput.value)
cityInput.value=''
cityInput.blur()
    }
})
cityInput.addEventListener('keydown', (event)=>{
    if(event.key == 'Enter' && cityInput.value.trim()!=''){
        updateWeatherInfo(cityInput.value)
        cityInput.value=''
        cityInput.blur()
    }
})
async function getFetchData(endPoint, city){
        const apiUrl =`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`
        const response = await fetch(apiUrl)
        return response.json()
}
function getWeatherIcon(id){
    if(id<=232) return 'thunderstorm.svg'
    if(id<=321) return 'drizzle.svg'
    if(id<=532) return 'rain.svg'
    if(id<=622) return 'snow.svg'
    if(id<=781) return 'atmosphere.svg'
    if(id<=800) return 'clear.svg'
    else return 'clouds.svg'
}
function getCurrentDate(){
const currentDate =new Date()
const options = {
    weekday:'short',
    day:'2-digit',
    month:'short'
}
return currentDate.toLocaleDateString('en-GB', options)
}
async function updateWeatherInfo(city){
    const weatherData=await getFetchData('weather', city)
    if(weatherData.cod!=200){
        showDisplaySection(notFoundSection)
        return 
    }
    console.log(weatherData)
    const{
        name:country,
        main:{temp,humidity},
        weather:[{id,main}],
        wind :{speed}
    } = weatherData

    cityText.textContent = country
    tempText.textContent =Math.round(temp) + '°C'
    humidityValueText.textContent = humidity + '%'
    conditionText.textContent = main
    windValueText.textContent = speed +'M/s'
    currentDateText.textContent = getCurrentDate()
    console.log(getCurrentDate())
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    await updateForecastsInfo(city)
    showDisplaySection(weatherInfoSection)
}
async function updateForecastsInfo(city){
    const forecastsData = await getFetchData('forecast', city)
    const timeTaken= '12:00:00'
    const todayDate= new Date().toISOString().split('T')[0]
    foreCastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather =>{
        if(forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate))
         updateForecastItems(forecastWeather)
    })
}

function updateForecastItems(weatherData){
console.log(weatherData)
const {
    dt_txt:date,
    weather:[{id}],
    main:{temp}
} = weatherData
    const dateTaken = new Date(date)
    const dateOption = {
        day:'2-digit',
        month:'short'
    }
    const dateResult = dateTaken.toLocaleDateString('en-US', dateOption)
    const foreCastItem = `
    <div class="forecast-item">
                    <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
                    <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
                    <div class="h5-forecast-item-temp regular-txt">${Math.round(temp)}°C</div>
                </div>
    `
foreCastItemsContainer.insertAdjacentHTML('beforeend', foreCastItem)

}
function showDisplaySection(section){
    [weatherInfoSection, searchCitySection, notFoundSection]
    .forEach(section=>section.style.display = 'none')
    section.style.display = 'flex'
}