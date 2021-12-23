// SLider

const searchValue = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const weatherCard = document.querySelector(".weather_card");
const contentBoxFiveDays = document.querySelector(".content_box_five_days");
const iconStatus = document.querySelector("#icon_status");
const tempStatus = document.querySelector("#temp_status");
const description = document.querySelector("#description");
const currentData = document.querySelector("#current_data");
const today = document.querySelector("#today");
const fiveDays = document.querySelector("#five_days");
const town = document.querySelector(".town");
const timeHourlyNow = document.querySelector(".time_hourly_now");
const center = document.querySelector(".center");
const timeHourlyBox = document.querySelector(".time_hourly");
const weatherWrapper = document.querySelector(".weather_wrapper");
const firstTown = document.querySelector(".first_town");
const secondTown = document.querySelector(".second_town");
const thirdTown = document.querySelector(".third_town");
const fourthTown = document.querySelector(".fourth_town");
const dayNight = document.querySelector(".wrapper");
const fiveDayBoxes = document.querySelectorAll(".five_day_boxes");
const searchBtnHeader = document.querySelector("#searchBtnHeader");

let options = {
  weekday: "long",
};
let option2 = {
  day: "numeric",
  month: "numeric",
};
let getDay = (date) => {
  let day = new Date(date * 1000);
  return day;
};
// запрос при клике на поиск

searchBtnHeader.addEventListener("click", function () {
  timeHourlyNow.innerHTML = ``;

  let api = `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue.value}&lang=ru&appid=34f43a858bf23ccc0aa2963cbf729cda`;
  fetch(api)
    .then((request) => request.json())
    .then((json) =>
      json.list.slice(0, 5).forEach((element) => {
        //вывод названия города
        town.innerHTML = `
                    <p>${json.city.name}</p>
                    `;
        //вывод времени
        currentData.innerHTML = "<p>Сейчас</p>";
        // вывод температуры
        tempStatus.innerHTML = `
                    <div class="feels_like">
                    <span class="temp">
                    ${Math.round(element.main.temp - 273) + "&deg" + "C"}
                    </span>
                    <span>
                    ${
                      "Feels like: " +
                      Math.round(element.main.feels_like - 273) +
                      "&deg"
                    }
                    </span>
                    </div>
                    `;
        // вывод иконки погоды
        iconStatus.innerHTML = `
                    <img src="https://openweathermap.org/img/wn/${element.weather[0]["icon"]}@2x.png">
                    <span>${element.weather[0]["main"]}</span>
                    
                    `;
        // добавить 0 , перевести вермя из миллисекунд
        Number.prototype.pad = function (size) {
          let time = String(this);
          if (time.length < (size || 2)) {
            time = "0" + time;
          }
          return time;
        };
        description.innerHTML = `
                    <span>Sunrise: ${sunrise(
                      json.city.sunrise,
                      json.city.timezone
                    )}</span>
                    <span>Sunset: ${sunset(
                      json.city.sunset,
                      json.city.timezone
                    )}</span>
                    <span>Wind: ${element.wind.speed + "m/s"}</span>
                    <span>Day duration: ${dayDuration(
                      json.city.sunrise,
                      json.city.sunset,
                      json.city.timezone
                    )}</span>
                    
                    `;
        //вывод дня недели
        let weekDay = () => {
          let day = "";
          day = new Date(element.dt * 1000 - 50000);
          day.getHours() + ":" + "00";
          day = day.toString().slice(0, 3);
          return day;
        };
        //вывод списка погоды по часам
        timeHourlyNow.innerHTML += `
                    <div class="day_box_weather ${element.sys.pod}">
                    <span>${element.dt_txt.slice(10, 16)}</span>
                    <span>${weekDay()}</span>
                    <span><img src="https://openweathermap.org/img/wn/${
                      element.weather[0]["icon"]
                    }@2x.png"></span>
                    <span>${element.weather[0]["main"]}</span>
                    <span class="temp temp_little">${
                      Math.round(element.main.temp - 273) + "&deg" + "C"
                    }</span>
                    <span><span style="color:var(--header-color)">Feels like:</span>+${
                      Math.round(element.main.feels_like - 273) + "&deg"
                    }</span>
                    <span><span style="color:var(--header-color)">Wind:</span>+${
                      Math.round(element.wind.speed) + " m/s"
                    }</span>
                    </div>
                    `;
        // console.log(element.sys.pod == "d");
        weatherCard.style.display = "flex";
        document.querySelector(".weather_wrapper").style.display = "flex";
        // Cмена дня и ноги БГ и карточки
        let dayBox = document.querySelector(`.${element.sys.pod}`);
        if (dayBox.classList == "n") {
          dayBox.classList.remove("day_box_weather");
          dayBox.classList.add("night_box_weather");
        } else if (dayBox.classList == "d") {
          dayBox.classList.remove("night_box_weather");
          dayBox.classList.add("day_box_weather");
        }
      })
    )
    .then(() => {
      $(".multiple-items").slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 3,
      });
    });
});

// действия для скрития блока на 5дней и вывода погоды на сегодня
today.addEventListener("click", function (e) {
  if (weatherCard.style.display == "none") {
    weatherCard.style.display = "flex";
    contentBoxFiveDays.style.display = "none";
  } else {
    contentBoxFiveDays.style.display = "none";
    weatherCard.style.display = "flex";
  }
});
// действия для скрития блока на "Сегодня" и вывода погоды на 5дней
fiveDays.addEventListener("click", function (e) {
  if (contentBoxFiveDays.style.display == "none") {
    contentBoxFiveDays.style.display = "block";
    weatherCard.style.display = "none";
  } else {
    weatherCard.style.display = "none";
    contentBoxFiveDays.style.display = "block";
  }
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${searchValue.value}&lang=ru&appid=34f43a858bf23ccc0aa2963cbf729cda`
  )
    .then((request) => request.json())
    .then((json) => {
      let weekDays = new Array(7);

      let day1 = getDayWeek(weekDays[0], json.list, 0);
      let day2 = getDayWeek(weekDays[1], json.list, 1);
      let day3 = getDayWeek(weekDays[2], json.list, 2);
      let day4 = getDayWeek(weekDays[3], json.list, 3);
      let day5 = getDayWeek(weekDays[4], json.list, 4);
      let day6 = getDayWeek(weekDays[5], json.list, 5);
      let day7 = getDayWeek(weekDays[6], json.list, 6);

      fiveDayBoxes[0].innerHTML = ``;
      day1.forEach((element) => {
        fiveDayBoxes[0].innerHTML += `
                    <div class="card-weather">
                                <span class="card-time">${timeZoneTime(
                                  element.dt,
                                  json.city.timezone
                                )}</span>
                                <img class="card-icon" src="https://openweathermap.org/img/wn/${
                                  element.weather[0]["icon"]
                                }@2x.png">
                                <span class='card-description' >${
                                  element.weather[0]["description"]
                                }</span>
    
                        <div class="box-weather">
                                <span class='card-humidity' >Влажность: ${
                                  element.main.humidity
                                } %</span>
                                <span class='card-wind'>Ветер: ${
                                  element.wind.speed + " м/с"
                                }</span>
                                <span class="temperature">Температура: ${
                                  Math.round(element.main.temp - 273) +
                                  "&deg" +
                                  "C"
                                }</span>
                        </div>
                    </div>
            
                `;
      });
      fiveDayBoxes[1].innerHTML = ``;
      day2.forEach((element) => {
        fiveDayBoxes[1].innerHTML += `
                    <div class="card-weather">
                                <span class="card-time">${timeZoneTime(
                                  element.dt,
                                  json.city.timezone
                                )}</span>
                                <img class="card-icon" src="https://openweathermap.org/img/wn/${
                                  element.weather[0]["icon"]
                                }@2x.png">
                                <span class='card-description' >${
                                  element.weather[0]["description"]
                                }</span>
    
                        <div class="box-weather">
                                <span class='card-humidity' >Влажность: ${
                                  element.main.humidity
                                } %</span>
                                <span class='card-wind'>Ветер: ${
                                  element.wind.speed + " м/с"
                                }</span>
                                <span class="temperature">Температура: ${
                                  Math.round(element.main.temp - 273) +
                                  "&deg" +
                                  "C"
                                }</span>
                        </div>
                    </div>
            
                `;
      });
      fiveDayBoxes[2].innerHTML = ``;
      day3.forEach((element) => {
        fiveDayBoxes[2].innerHTML += `
                    <div class="card-weather">
                                <span class="card-time">${timeZoneTime(
                                  element.dt,
                                  json.city.timezone
                                )}</span>
                                <img class="card-icon" src="https://openweathermap.org/img/wn/${
                                  element.weather[0]["icon"]
                                }@2x.png">
                                <span class='card-description' >${
                                  element.weather[0]["description"]
                                }</span>
    
                        <div class="box-weather">
                                <span class='card-humidity' >Влажность: ${
                                  element.main.humidity
                                } %</span>
                                <span class='card-wind'>Ветер: ${
                                  element.wind.speed + " м/с"
                                }</span>
                                <span class="temperature">Температура: ${
                                  Math.round(element.main.temp - 273) +
                                  "&deg" +
                                  "C"
                                }</span>
                        </div>
                    </div>
            
                `;
      });
      fiveDayBoxes[3].innerHTML = ``;
      day4.forEach((element) => {
        fiveDayBoxes[3].innerHTML += `
                    <div class="card-weather">
                                <span class="card-time">${timeZoneTime(
                                  element.dt,
                                  json.city.timezone
                                )}</span>
                                <img class="card-icon" src="https://openweathermap.org/img/wn/${
                                  element.weather[0]["icon"]
                                }@2x.png">
                                <span class='card-description' >${
                                  element.weather[0]["description"]
                                }</span>
    
                        <div class="box-weather">
                                <span class='card-humidity' >Влажность: ${
                                  element.main.humidity
                                } %</span>
                                <span class='card-wind'>Ветер: ${
                                  element.wind.speed + " м/с"
                                }</span>
                                <span class="temperature">Температура: ${
                                  Math.round(element.main.temp - 273) +
                                  "&deg" +
                                  "C"
                                }</span>
                        </div>
                    </div>
            
                `;
      });
      fiveDayBoxes[4].innerHTML = ``;
      day5.forEach((element) => {
        fiveDayBoxes[4].innerHTML += `
                    <div class="card-weather">
                                <span class="card-time">${timeZoneTime(
                                  element.dt,
                                  json.city.timezone
                                )}</span>
                                <img class="card-icon" src="https://openweathermap.org/img/wn/${
                                  element.weather[0]["icon"]
                                }@2x.png">
                                <span class='card-description' >${
                                  element.weather[0]["description"]
                                }</span>
    
                        <div class="box-weather">
                                <span class='card-humidity' >Влажность: ${
                                  element.main.humidity
                                } %</span>
                                <span class='card-wind'>Ветер: ${
                                  element.wind.speed + " м/с"
                                }</span>
                                <span class="temperature">Температура: ${
                                  Math.round(element.main.temp - 273) +
                                  "&deg" +
                                  "C"
                                }</span>
                        </div>
                    </div>
            
                `;
      });
      // fiveDayBoxes[5].innerHTML = ``
      // day6.forEach(element => {
      //     fiveDayBoxes[5].innerHTML += `
      //         <div class="card-weather">
      //                     <span class="card-time">${timeZoneTime(element.dt,json.city.timezone)}</span>
      //                     <img class="card-icon" src="https://openweathermap.org/img/wn/${element.weather[0]["icon"]}@2x.png">
      //                     <span class='card-description' >${element.weather[0]['description']}</span>

      //             <div class="box-weather">
      //                     <span class='card-humidity' >Влажность: ${element.main.humidity} %</span>
      //                     <span class='card-wind'>Ветер: ${element.wind.speed + " м/с"}</span>
      //                     <span class="temperature">Температура: ${Math.round(element.main.temp - 273) + "&deg"+"C"}</span>
      //             </div>
      //         </div>

      //     `
      // })
    });
});

// выводит города рядом
fetch(
  "https://api.openweathermap.org/data/2.5/weather?id=710791&lang=ru&appid=34f43a858bf23ccc0aa2963cbf729cda"
)
  .then((request) => request.json())
  .then(
    (json) =>
      (firstTown.innerHTML = `
            
                <span>${json.name}</span>
                <span><img src="https://openweathermap.org/img/wn/${
                  json.weather[0]["icon"]
                }@2x.png"></span>
                <span>${
                  Math.round(json.main.temp - 273) + "&deg" + "C"
                }</span>         
            
            `)
  );
fetch(
  "https://api.openweathermap.org/data/2.5/weather?id=702550&lang=ru&appid=34f43a858bf23ccc0aa2963cbf729cda"
)
  .then((request) => request.json())
  .then(
    (json) =>
      (secondTown.innerHTML = `
                <span>${json.name}</span>
                <span><img src="https://openweathermap.org/img/wn/${
                  json.weather[0]["icon"]
                }@2x.png"></span>
                <span>${
                  Math.round(json.main.temp - 273) + "&deg" + "C"
                }</span>      
            
            `)
  );
fetch(
  "https://api.openweathermap.org/data/2.5/weather?id=698740&lang=ru&appid=34f43a858bf23ccc0aa2963cbf729cda"
)
  .then((request) => request.json())
  .then(
    (json) =>
      (thirdTown.innerHTML = `
            
                <span>${json.name}</span>
                <span><img src="https://openweathermap.org/img/wn/${
                  json.weather[0]["icon"]
                }@2x.png"></span>
                <span>${Math.round(json.main.temp - 273) + "&deg" + "C"}</span>
            
            `)
  );
fetch(
  "https://api.openweathermap.org/data/2.5/weather?id=706483&lang=ru&appid=34f43a858bf23ccc0aa2963cbf729cda"
)
  .then((request) => request.json())
  .then(
    (json) =>
      (fourthTown.innerHTML = `   
                <span>${json.name}</span>
                <span><img src="https://openweathermap.org/img/wn/${
                  json.weather[0]["icon"]
                }@2x.png"></span>
                <span>${Math.round(json.main.temp - 273) + "&deg" + "C"}</span>
            
            `)
  );

let data = new Date();
let weatherDays = document.querySelector(".weather_days");
let header = document.querySelector(".header");

if (data.getHours() >= 19) {
  dayNight.classList.add("night");
  dayNight.classList.remove("wrapper");
  weatherWrapper.style.color = "white";
  weatherDays.style.cssText = "background-color:#c5c5c5;; color: black;";
  header.style.cssText = "background-color:black; color:white";
} else {
  dayNight.classList.add("wrapper");
  dayNight.classList.remove("night");
  weatherWrapper.style.color = "black";
  weatherDays.style.cssText = "background-color:black; color: white;";
  header.style.cssText = "background: var(--header-color); color:black";
}
// найти дни недели
let getDayWeek = (weekDay, json, day) => {
  let presentDay = new Date();
  day = presentDay.getDay() + day;
  if (day >= 7) {
    day = day - 7;
  }
  weekDay = json.filter((e) => {
    return getDay(e.dt).getDay() == day;
  });

  return weekDay;
};

// вывод описания погоды и восход/закат
let sunrise = (jsonData, timezone) => {
  let x = +getDay(jsonData).getUTCHours().pad() + timezone / 3600;
  let y = getDay(jsonData).getUTCMinutes().pad();
  if (x > 24) {
    return (
      +getDay(jsonData).getUTCHours().pad() + (timezone / 3600 - 24) + ":" + y
    );
  } else return x + ":" + y;
};

let sunset = (jsonData, timezone) => {
  if (timezone < 0) {
    return (
      24 +
      (+getDay(jsonData).getUTCHours().pad() + (timezone / 3600 - 24)) +
      ":" +
      getDay(jsonData).getUTCMinutes().pad()
    );
  } else
    return (
      +getDay(jsonData).getUTCHours().pad() +
      timezone / 3600 +
      ":" +
      getDay(jsonData).getUTCMinutes().pad()
    );
};

let timeZoneTime = (elDate, timezone) => {
  let hours = getDay(elDate).getUTCHours() + timezone / 3600;
  if (hours < 0) {
    return (24 + hours).pad() + ":" + getDay(elDate).getUTCMinutes().pad();
  } else if (hours >= 24) {
    return (hours - 24).pad() + ":" + getDay(elDate).getUTCMinutes().pad();
  } else return hours.pad() + ":" + getDay(elDate).getUTCMinutes().pad();
};

//TABS
function openCity(evt, cityName) {
  // Declare all variables
  var i, tabcontent, weekday;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("five_day_boxes");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  weekday = document.getElementsByClassName("weekday");
  for (i = 0; i < weekday.length; i++) {
    weekday[i].className = weekday[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "flex";
  evt.currentTarget.className += " active";
  let fiveDiv = document.querySelector(".five_day_boxes_div");
  fiveDiv.style.display = "flex";
}
//data & day
Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
let weekday = document.querySelectorAll(".weekday");
let renderWeekDay = () => {
  let presentTime = new Date().addDays(1);
  weekday.forEach((div) => {
    div.innerHTML = `
            <span class='weekDay'>${presentTime.toLocaleString(
              "Ru",
              options
            )} </span>
            <span>${presentTime.toLocaleString("Ru", option2)} </span>

            `;
    presentTime = presentTime.addDays(1);
  });
};
renderWeekDay();

//длительность дня
let dayDuration = (sunRis, sunSet, timezone) => {
  let rise = sunrise(sunRis, timezone).split(":");
  let set = sunset(sunSet, timezone).split(":");
  let durDay = [set[0] - rise[0], set[1] - rise[1]];
  if (durDay[1] < 0) {
    durDay[1] += 60;
    durDay[0] -= 1;
  }

  return durDay[0].pad() + ":" + durDay[1].pad();
};
