const apiKey = "25ab3c34a12d0c6508e3ac9bdd6bfe25";
const myurl = "http://api.openweathermap.org/data/2.5/forecast?appid=";

const city = "&q=Minneapolis";


$(document).ready(() => letsGo());



function letsGo() {

    $.ajax({
        url: myurl + apiKey + city,
        method: "GET"
    }).then(function (response) {
        console.log(response);


    });


}



