$(document).ready(function() {
    var location;
    checkStorage();
    
    //target form for location submission and set an event listener for submit
    $("#location-form").on("submit", function(event) {
        event.preventDefault(); 
        //take value from inside input field and store in variable
        location = $("#location-input").val();
        displayWeather();
        
    })



    function checkStorage() {
    //check if local storage present for city and display weather
    if(!localStorage.getItem("city")) {
        return
    } else {
        location = localStorage.getItem("city");
        displayWeather()
    }
    }

    function displayWeather() {
    //take location and pass it through openweathermap API
    var APIKey = "0fdfab0bcf3590a8e7a2c9aecb8d3388";
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + APIKey + "&units=metric";
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        //take location, temperature and icon from response and store in variable
        var city = response.name;
        //store location in local storage so it can be displayed on load
        localStorage.setItem("city", response.name);
        var temperature = response.main.temp;
        temperature = temperature.toFixed(0);
        var iconCode = response.weather[0].icon;
        console.log(city,temperature,iconCode)
        var iconImg = $("<img>").attr("src", `https://openweathermap.org/img/wn/${iconCode}.png`)
        //add reset button 
        var resetBtn = $("<button>").attr({
            "class": "btn p-0 pr-1",
            "id": "reset-button"
        });
        //add reset icon
        var resetIcon = $("<i>").attr({
            "class": "fa-solid fa-rotate-right",
            "style": "color: #ffffff"
        
        });
        resetBtn.append(resetIcon);
        //set form display to none
        $("#location-form").attr("class", "form-inline float-right m-2 d-none");
        //add new div in nav bar
        var weatherDisplay = $("<div>").attr("class", "float-right");
        weatherDisplay.css("color", "#ffffff");
        //display location name, temperature and icon
        weatherDisplay.text(`${location}, ${temperature}°C`);
        weatherDisplay.append(iconImg, resetBtn);
        $("#header").append(weatherDisplay);

    })
    }

    //add event listener to reset button
    $("#header").on("click", "button", function(event){
        $("#header").children("div").remove();
        $("#location-form").attr("class", "form-inline float-right m-2");
    })


})