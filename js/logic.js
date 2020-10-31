const apiKey = "25ab3c34a12d0c6508e3ac9bdd6bfe25";
const myurl = "http://api.openweathermap.org/data/2.5/";
const forecast = "forecast?appid=";
const currentDate = moment().format('MM/DD/YYYY');

let searchHistory = [];
let fiveDayArray = [];


$(document).ready(() => letsGo());


function letsGo() {

    $('#search-button').on('click', function () {

        searchACity(document.querySelector('#search-field').value);

    });

    if ($('#search-results').length > 0) {

        $(document).on("click", ".list-group-item", function () {

            searchACity(this.textContent);

        });
    }
}

function kelvinToFarenheit(kelvin) {

    return (kelvin - 273.15) * 1.8 + 32;

}

function searchACity(cityName) {
    $('#five-boxes').html("");
    fiveDayArray = [];

    $.ajax({
        url: myurl + forecast + apiKey + "&q=" + cityName,
        method: "GET",
        error: function () {
            // we need some sort of notification to the user 
            console.log('sorry, that city doesnt exist');

        },
        success: function () {
            document.querySelector("#search-results").innerHTML = "";
        }
    }
    ).then(function (response) {

        let currentWeatherIcon = response.list[0].weather[0].icon;

        let picUrl = "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";


        // update the HTML with the response info
        document.querySelector("#results-city-name").textContent = response.city.name;

        document.querySelector("#results-temperature").textContent = "Temperature: " +
            kelvinToFarenheit(parseFloat(response.list[0].main.temp)).toFixed(1) + "°F";


        console.log(response);

        document.querySelector("#results-humidity").textContent = "Humidity: " + response.list[0].main.humidity + "%";

        document.querySelector("#results-wind-speed").textContent = "Wind Speed: " + response.list[0].wind.speed + " MPH";

        document.querySelector("#results-date").textContent = "\xa0\xa0(" + currentDate + ")";


        $("#results-icon").attr("src", picUrl);

        // get the UV Index based on the latitude & longitude
        uvSearch(response.city.coord.lat, response.city.coord.lon);

        // build the 5 day forecast 
        fiveDayForecast(response.list);

        // add the city name to the searchResults array

        searchHistory.push(cityName);

        // this will keep the search history to max 8 results
        if (searchHistory.length >= 9) {
            searchHistory.shift();
        }

        // reverses the array order, iterates, then print items to the ordered list

        searchHistory.slice().reverse().forEach(function (name) {

            let listItem = $('<li>').text(name).addClass("list-group-item");

            $('#search-results').append(listItem);

        });

    });

    function uvSearch(lat, lon) {
        $.ajax({

            url: myurl + `uvi?lat=${lat}&lon=${lon}&appid=` + apiKey,
            method: "GET"

        }).then(function (response) {


            $('#uvSpan').css("padding", "5px");
            if (response.value < 3) {
                $('#uvSpan').css("background-color", "green");
            } else if (response.value > 2 && response.value < 6) {
                $("#uvSpan").css("background-color", "yellow");
            } else {
                $('#uvSpan').css("background-color", "red");
            }
            document.querySelector("#uvSpan").textContent = response.value;

        });
    };
}

function fiveDayForecast(list) {
    let numberOfDays = 2;

    list.forEach(function (i) {


        let iteratedDate = moment(i.dt_txt).format("MM DD YYYY");
        let checkDate = moment().add(numberOfDays, 'days').format("MM DD YYYY");

        if (checkDate === iteratedDate && numberOfDays < 7) {


            // use fiveDayArray to add each day's relevant info 
            // we need: date, icon, max_temp & humidity

            fiveDayArray.push({

                date: iteratedDate,
                icon: i.weather[0].icon.replace("n", "d"),
                temp_max: i.main.temp_max,
                humidity: i.main.humidity

            });

            numberOfDays++;
        }
    });

    // converts object array to a Set which is a lazy way to remove duplicates due to crappy noob code :)
    let uniqueSet = [...new Set(fiveDayArray)];

    // use uniqueSet to build the five day forecast boxes
    buildFiveBoxes(uniqueSet);

};


function buildFiveBoxes(box) {

    console.log(box);

    box.forEach(function (index) {

        let newBox = $("<div>");
        newBox.addClass("fiveDayBox");
        newBox.text(index.date);
        let picUrl = "http://openweathermap.org/img/wn/" + index.icon + "@2x.png";
        let newPic = $("<img>").attr("src", picUrl);
        newBox.append(newPic);
        let tempSpan = $("<span>").text(kelvinToFarenheit(index.temp_max).toFixed(2) + "°F").css("text-align", "center").css("font-size", "40px").css("padding-bottom", "10px");
        newBox.append(tempSpan);
        let humiditySpan = $("<span>").text("Humidity: " + index.humidity + "%").css("text-align", "center");
        newBox.append("<br>");
        newBox.append(humiditySpan);

        $("#five-boxes").append(newBox);

    });

}

