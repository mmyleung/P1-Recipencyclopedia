//target form for location submission and set an event listener for submit
$("#location-form").on("submit", function(event) {
    event.preventDefault();
    console.log("submitted");   
})