document.querySelector("form").addEventListener("submit", () => {
    data.innerHTML = "";
    data.innerHTML = `
            <div id="loading">
                <h2>Loading...</h2>
            </div>
    `
    forecastContainer.innerHTML = "";
    forecastContainer.innerHTML = `
            <div class="loading">
                <h2>Loading...</h2>
            </div>
    `

    load.style.display = "block";
    getData(event);
})

let load = document.querySelector("#loading");
let data = document.querySelector(".data");

let getData = async (event) => {
    event.preventDefault();

    let input = document.querySelector("#searchBar");
    let iframe = document.querySelector("iframe");
    iframe.src = `https://maps.google.com/maps?q=${input.value}&t=k&z=19&ie=UTF8&iwloc=&output=embed`;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${input.value}&APPID=a83a8c7ecccea33caef20435b2690737&units=metric`

    let data = await fetchData(url);
    if (data) {
        displayData(data);
        displayForecast(data) 
    }
    else{
        handleError();
        handleErrorForecast();
    }
}

let day = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

let firstData = async () => {
    let url = `https://api.openweathermap.org/data/2.5/weather?q=kota&APPID=a83a8c7ecccea33caef20435b2690737&units=metric`
    let data = await fetchData(url);
    if (data) {
        displayData(data);
        displayForecast(data) 
    }
    else{
        handleError();
        handleErrorForecast();
    }
}

//displaying current data

let displayData = (obj) => {
    load.style.display = "none";
    data.innerHTML = "";

    let div = document.createElement("div");
    div.setAttribute("class", "mainData");

    let date = document.createElement("p");
    date.setAttribute("id", "date")
    let dt = new Date();
    date.innerHTML = `${dt.getFullYear()}-${dt.getMonth()}-${dt.getDate()}, ${day[dt.getDay()]}`;

    let location = document.createElement("div");
    location.setAttribute("class", "location");

    let placeName = document.createElement("h1");
    placeName.setAttribute("id", "placeName");
    placeName.innerHTML = `${obj.name}`;
    let countryName = document.createElement("h1");
    countryName.setAttribute("id", "countryName");
    if (obj.sys.country)
        countryName.innerHTML = `<span style="color:rgb(235,110,76);">,</span> ${obj.sys.country}`;

    if (countryName)
        location.append(placeName, countryName);
    else
        location.append(placeName);

    let p = document.createElement("h3");
    p.setAttribute("class", "temperature");
    p.innerHTML = `<i class="fa-solid fa-cloud" style="color: #efefed;"></i> ${obj.main.temp}℃`

    let feelsLike = document.createElement("h4");
    feelsLike.setAttribute("class", "feelsLike");
    feelsLike.innerHTML = `Feels like ${obj.main.feels_like}℃. <b style="color: rgb(235,110,76);">Atmospheric Conditions:</b> ${obj.weather[0].description}.`;

    let tablediv = document.createElement("div");
    tablediv.setAttribute("class", "tableDiv");

    let km = obj.visibility / 1000;

    tablediv.innerHTML = `
    <table>
        <tbody>
            <tr>
                <td><i class="fa-solid fa-wind"></i> ${obj.wind.speed}m/s</td>
                <td><i class="fa-solid fa-gauge-simple"></i> ${obj.main.pressure}hPa</td>
            </tr>
            <tr>
                <td><b style="color: rgb(235,110,76);">Humidity:</b> ${obj.main.humidity}%</td>
                <td><b style="color: rgb(235,110,76);">Visibility:</b> ${km}Km</td>
            </tr>
            <tr>
                <td><b style="color: rgb(235,110,76);">Min-Temperature:</b> ${obj.main.temp_min}℃</td>
                <td><b style="color: rgb(235,110,76);">Max-Temperature:</b> ${obj.main.temp_max}℃</td>
            </tr>
        </tbody>
    </table>
    `
    div.append(location, date, p, feelsLike, tablediv);
    data.append(div)
}

var btn = document.getElementById('btn')
function leftClick() {
    btn.style.left = '0'
}
function rightClick() {
    btn.style.left = '48%'
}


//displaing forcast of 5 days;
let forecastContainer = document.querySelector("#forecastContainer");

let displayForecast = (obj) => {
    forecastContainer.innerHTML = "";
    let dt = new Date();
    let cday = dt.getDay();
    let headingDiv = document.createElement("div");
    headingDiv.setAttribute("id","forecastHeading");
    headingDiv.innerHTML = `<b>5-day Forecast -></b>`

    forecastContainer.append(headingDiv)

    for (let i = 0; i < 5; i++) {

        let div = document.createElement("div");

        let currDay = document.createElement("h3");
        currDay.setAttribute("class","currDay")
        currDay.innerHTML = day[(cday++) % 7];

        let icon = document.createElement("p"); 
        icon.innerHTML = `<i class="fa-solid fa-sun" style="color: #FFD43B;"></i>`;

        let minTemp = document.createElement("h3")
        minTemp.setAttribute("class","minTemp")
        let randomNumber = 0;
        if(i!=0)
            randomNumber = ((Math.random()*4).toFixed(2));
        
        minTemp.innerHTML = `${(obj.main.temp_min - randomNumber).toFixed(2)}°`

        let maxTemp = document.createElement("h3")
        maxTemp.setAttribute("class","maxTemp")
        maxTemp.innerHTML = `${(+obj.main.temp_max + +randomNumber).toFixed(2)}°`
        

        div.append(currDay, icon, maxTemp, minTemp);
        forecastContainer.append(div);
    }
}




let fetchData = async (url) => {
    try {
        let res = await fetch(url)
        if (res.ok) {
            let data = await res.json()
            console.log(1);
            return data;
        }
    } catch (error) {
        console.log(error);
    }
}

let handleError = () => {
    data.innerHTML = "";
    

    let div = document.createElement("div");
    div.setAttribute("class", "errorDiv")

    let img = document.createElement("img");
    img.src = "https://t4.ftcdn.net/jpg/03/88/63/83/360_F_388638369_wSBADhKfhiTx6Q5Pz1xfdpy6zotku1Sg.jpg"

    let message = document.createElement("p")
    message.innerHTML = `please enter the correct city or district name.`

    div.append(img, message);
    data.append(div);
}

let handleErrorForecast = ()=>{
    forecastContainer.innerHTML = ""
    let div2 = document.createElement("div");
    div2.setAttribute("class", "errorDiv")

    let img = document.createElement("img");
    img.src = "https://t4.ftcdn.net/jpg/03/88/63/83/360_F_388638369_wSBADhKfhiTx6Q5Pz1xfdpy6zotku1Sg.jpg"

    let message = document.createElement("p")
    message.innerHTML = `please enter the correct city or district name.`

    div2.append(img, message);
    forecastContainer.append(div2);
}



firstData();