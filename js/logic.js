const apiKey = "25ab3c34a12d0c6508e3ac9bdd6bfe25";
const myurl = "http://api.openweathermap.org/data/2.5/forecast?appid=";

let searchHistory = [];


$(document).ready(() => letsGo());



function letsGo() {

    $('#search-button').on('click', function () {

        searchACity(document.querySelector('#search-field').value);

    });
}

function searchACity(cityName) {

    document.querySelector("#search-results").innerHTML = "";

    $.ajax({
        url: myurl + apiKey + "&q=" + cityName,
        method: "GET"
    }).then(function (response) {

        // add the city name to the searchResults array

        searchHistory.push(cityName);
        console.log('value of searchHistory array: ' + searchHistory);

        // this will keep the search history to max 8 results
        if (searchHistory.length >= 9) {
            searchHistory.shift();
        }

        // iterate over the search history array and print items to the ordered list

        searchHistory.slice().reverse().forEach(function (name) {
            let listItem = $('<li>').text(name).addClass("list-group-item");

            $('#search-results').append(listItem);

        });

    });
}



