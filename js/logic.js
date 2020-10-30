const apiKey = "25ab3c34a12d0c6508e3ac9bdd6bfe25";
const myurl = "http://api.openweathermap.org/data/2.5/";
const forecast = "forecast?appid=";


const currentDate = moment().format('MM/DD/YYYY');

let searchHistory = [];


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
        // update the HTML with the response info
        document.querySelector("#results-city-name").textContent = response.city.name;

        document.querySelector("#results-temperature").textContent = "Temperature: " +
            kelvinToFarenheit(parseFloat(response.list[0].main.temp)).toFixed(1) + "°F";


        console.log(response);

        document.querySelector("#results-humidity").textContent = "Humidity: " + response.list[0].main.humidity + "%";

        document.querySelector("#results-wind-speed").textContent = "Wind Speed: " + response.list[0].wind.speed + " MPH";

        document.querySelector("#results-date").textContent = "\xa0\xa0(" + currentDate + ")";

        console.log("lat: " + response.city.coord.lat);
        console.log("lon: " + response.city.coord.lon);


        uvSearch(response.city.coord.lat, response.city.coord.lon);

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

            console.log(response.value);
            document.querySelector("#results-uv-index").textContent = "UV Index: " + response.value;

        });
    };
}



