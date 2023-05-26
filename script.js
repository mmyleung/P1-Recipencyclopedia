//target form for location submission and set an event listener for submit
$("#location-form").on("submit", function(event) {
    event.preventDefault();
    console.log("submitted");   
    //take value from inside input field and store in variable
    var location = $("#location-input").val();
    console.log(location);
    //take location and pass it through openweathermap API
    var APIKey = "0fdfab0bcf3590a8e7a2c9aecb8d3388";
    var queryUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&appid=" + APIKey;
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function(response){
        console.log(response);
    })
})