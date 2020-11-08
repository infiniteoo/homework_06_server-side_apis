const apiKey = "25ab3c34a12d0c6508e3ac9bdd6bfe25";
const myurl = "http://api.openweathermap.org/data/2.5/";
const forecast = "forecast?appid=";
const weatherCall = "weather?appid=";
const currentDate = moment().format('MM/DD/YYYY');

let searchHistory = [];
let fiveDayArray = [];


// thanks to w3schools for this bit of code and teaching me the (very basic) ways of geolocating. 

function getLocation() {

    // the user needs to agree to allow to search their location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handle_error);

    }

    function handle_error(err) {

        if (err.code == 1) {

            // user said no! set default coords to Minneapolis/St. Paul
            userLat = 44.98;
            userLong = -93.27;

            $.ajax({
                url: myurl + weatherCall + apiKey + "&lat=" + userLat.toFixed(1) + "&lon=" + userLong.toFixed(0),
                method: "GET",

            }).then(function (r) {

                searchACity(r.name);

            });
        }
    }

    function showPosition(position) {
        if (navigator.geolocation) {
            userLat = position.coords.latitude;
            userLong = position.coords.longitude;
        } else {
            userLat = 44.9818;
            userLong = 93.2775;
        }

        $.ajax({
            url: myurl + weatherCall + apiKey + "&lat=" + userLat.toFixed(4) + "&lon=" + userLong.toFixed(4),
            method: "GET",

        }).then(function (r) {

            searchACity(r.name);

        });
    }
};


// just to ensure jQuery doesn't jump the gun on the HTML/CSS...
$(document).ready(() => letsGo());


// set up the main search button and search history event listeners
function letsGo() {

    getLocation();

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

    // reset the five day forecast div & array for new data
    $('#five-boxes').html("");
    fiveDayArray = [];

    // make async call and search for the user's request
    $.ajax({
        url: myurl + weatherCall + apiKey + "&q=" + cityName,
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

        // prepare the icon URL
        let currentWeatherIcon = response.weather[0].icon;
        let picUrl = "http://openweathermap.org/img/wn/" + currentWeatherIcon + "@2x.png";

        // update the HTML with the response info
        document.querySelector("#results-city-name").textContent = response.name;

        document.querySelector("#results-temperature").textContent = "Temperature: " +
            kelvinToFarenheit(parseFloat(response.main.temp)).toFixed(1) + "°F";

        document.querySelector("#results-humidity").textContent = "Humidity: " + response.main.humidity + "%";

        document.querySelector("#results-wind-speed").textContent = "Wind Speed: " + response.wind.speed + " MPH";

        document.querySelector("#results-date").textContent = "\xa0\xa0(" + currentDate + ")";

        $("#results-icon").attr("src", picUrl);

        // get the UV Index based on the latitude & longitude
        uvSearch(response.coord.lat, response.coord.lon);

        // build the 5 day forecast 
        fiveDayForecast(response.name);

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

    // find the UV index of a city based on its coordinates
    function uvSearch(lat, lon) {

        $.ajax({

            url: myurl + `uvi?lat=${lat}&lon=${lon}&appid=` + apiKey,
            method: "GET"

        }).then(function (response) {

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

function fiveDayForecast(cityName) {

    // counting variable used in moment() logic check
    let numberOfDays = 1;

    // make async call and make a forecast search 
    $.ajax({
        url: myurl + forecast + apiKey + "&q=" + cityName,
        method: "GET"
    }
    ).then(function (response) {
        let hottestTemp = 0;

        // check each item in response array for a date match
        response.list.forEach(function (i) {

            let iteratedDate = moment(i.dt_txt).format("MM DD YYYY");

            let checkDate = moment().add(numberOfDays, 'days').format("MM DD YYYY");

            if (checkDate === iteratedDate & numberOfDays < 6) {

                // iterate again & look for hottest prediction of that day
                response.list.forEach(function (x) {
                    let iteratedDate2 = moment(x.dt_txt).format("MM DD YYYY");

                    if (checkDate === iteratedDate2 && x.main.temp_max > hottestTemp) {

                        topIcon = x.weather[0].icon;
                        hottestTemp = x.main.temp_max;
                        topHumidity = x.main.humidity;
                    }
                });

                fiveDayArray.push({

                    date: iteratedDate,
                    icon: topIcon,
                    temp_max: hottestTemp,
                    humidity: topHumidity

                });

                numberOfDays++;

            };

            hottestTemp = 0;

        });
        // generated the five day forecast from the array we built
        buildFiveBoxes(fiveDayArray);
    });
};


function buildFiveBoxes(box) {

    box.forEach(function (index) {
        // this box will hold all the info
        let newBox = $("<div>");
        newBox.addClass("fiveDayBox");
        newBox.text(index.date);

        // build the weather icon picture
        let picUrl = "http://openweathermap.org/img/wn/" + index.icon + "@2x.png";
        let newPic = $("<img>").attr("src", picUrl).attr("alt", "weather icon");
        newBox.append(newPic);

        // the temperature span 
        let tempSpan = $("<span>").text(kelvinToFarenheit(index.temp_max).toFixed(2) + "°F").css("text-align", "center").css("font-size", "40px").css("padding-bottom", "10px");
        newBox.append(tempSpan);

        // the humidity span
        let humiditySpan = $("<span>").text("Humidity: " + index.humidity + "%").css("text-align", "center");
        newBox.append("<br>");
        newBox.append(humiditySpan);

        // add the box to the UI
        $("#five-boxes").append(newBox);

    });

}



