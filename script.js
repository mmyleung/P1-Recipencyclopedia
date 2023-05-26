$(document).ready(function() {
    var location;
    var storedIDs = [];
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
    var weatherUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=" + APIKey + "&units=metric";
    $.ajax({
        url: weatherUrl,
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

    //add event listener to submit to ingredients form
    $("#ingredient-form").on("submit", function(event){
        event.preventDefault();
        //empty recipe-display
        $("#recipe-display").empty();
        //store ingredient input into variable
        var ingredient = $("#ingredient-input").val();
        console.log(ingredient);
        //use ingredient to pass through themealDB api
        var mealUrl = "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredient;

        //api call
        $.ajax({
            url: mealUrl,
            method: "GET"
        }).then(function(response){
            if(!response.meals) {
                $("#recipe-display").append($("<div>").text("No results found - please try again with another ingredient!")
                .attr({
                    "style": "color: #8d8741",
                    "class": "text-center"
            }))
            } else {
            console.log(response);
            //use for loop to display the data
            var row = $("<div>").attr("class", "row");
            for (let i = 0; i < response.meals.length; i++) {
                //store data into variables
                var mealName = response.meals[i].strMeal;
                var mealImgUrl = response.meals[i].strMealThumb;
                var mealID = response.meals[i].idMeal;
                //create columns
                var col = $("<div>").attr("class", "col-sm-4");
                //create card to append elements
                var mealCard = $("<div>").attr({
                    "class": "card mb-4 rounded",
                    "style": "background-color: transparent; border:none"
                })
                //create new elements
                var mealImg = $("<img>").attr({
                    "src": mealImgUrl,
                    "class": "card-img-top rounded meal-img-button",
                    "style": "border:2px solid #bc986a",
                    "alt": mealName,
                    "id": mealID
                })
                var mealCardBody = $("<div>").attr({
                    "class": "card-body p-1",
                    "style": "background-color: transparent"
                });
                var mealNameP = $("<p>").text(mealName).attr({
                    "class": "card-text text-center",
                    "style": "background-color: transparent; color: #bc986a"
                });
                mealCardBody.append(mealNameP)
                mealCard.append(mealImg, mealCardBody);
                col.append(mealCard);
                row.append(col);
            }
            $("#recipe-display").append(row);
        }
        })
        
    })

    //add event listener on recipe-display
    $("#recipe-display").on("click", "img", function(event) {
        //store image id in variable
        var mealID = $(this).attr("id");
        var recipeUrl = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealID;
        $.ajax({
            url: recipeUrl,
            method: "GET"
        }).then(function(response){
            console.log(response);
            $("#recipe-modal").modal("show");
            //store data into variables
            var recipeName = response.meals[0].strMeal;
            var recipeID = response.meals[0].idMeal;
            var recipeRegion = response.meals[0].strArea;
            var recipeImgUrl = response.meals[0].strMealThumb;
            var recipeInstructions = response.meals[0].strInstructions;
            //loop through ingredients and measures and concat into one string
            //add li element and set text to ingredients
            for (let i = 1; i < 21; i++) {
                var listEl = $("<li>").attr("class","list-group-item");
                var recipeIngredient = response.meals[0]["strIngredient"+i];
                var recipeMeasure = response.meals[0]["strMeasure"+i];
                //check if stored value is not "", then add text to list element
                if(recipeIngredient != "") {
                    listEl.text(`${recipeMeasure} ${recipeIngredient}`);
                    $("#ingredient-list").append(listEl);
                }
            }
            //add data to modal
            $(".recipe-title").text(`${recipeName} - ${recipeRegion}`).attr("id", recipeID);
            $("#recipeImg").attr("src", recipeImgUrl);
            $("#recipeInstructions").text(recipeInstructions);
        })
    })

    //add event listener to favourite button
    $("#favourite-button").on("click", function(event){
        console.log("hearts");
        //store id of recipe
        var ID = $(this).next().attr("id");
        if(!localStorage.getItem("mealID")){
            storedIDs.push(ID);
        } else {
            storedIDs = JSON.parse(localStorage.getItem("mealID"));
            storedIDs.push(ID)
        }
        
        localStorage.setItem("mealID", JSON.stringify(storedIDs));
        displayFavourites();
    })

    //add function that displays the favourite meals at the footer
    function displayFavourites() {
        if(!localStorage.getItem("mealID")){
            return;
        } else {
            storedIDs = JSON.parse(localStorage.getItem("mealID"));
            //for loop to loop through the storedIDs array
            for (let i = 0; i < storedIDs.length; i++) {
                var getImgURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + storedIDs[i];
                //ajax call
                $.ajax({
                    url: getImgURL,
                    method: "GET"
                }).then(function(response){
                    console.log(response);
                })
            }
        }
    }

})