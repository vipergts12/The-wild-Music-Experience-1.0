
// // Your web app's Firebase configuration
// search google ad sense//


var firebaseConfig = {
    apiKey: "AIzaSyBC9EdzFuCmH14viAgGa7joQBxcr2H_a1c",
    authDomain: "the-wild-music-experience.firebaseapp.com",
    databaseURL: "https://the-wild-music-experience.firebaseio.com",
    projectId: "the-wild-music-experience",
    storageBucket: "",
    messagingSenderId: "885036588462",
    appId: "1:885036588462:web:b52fe4c987259292e67c3f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Matt's code: 
$("#submit").on("click", function () {
    event.preventDefault();
    if (!$("#search").val() || !$("#number-of-results").val()) {
        // If one (or both) of the text boxes are blank
        return;
    }
    $("#test").empty();
    var search = $("#search").val();
    var numberOfResults = $("#number-of-results").val(); // Only used with Musixmatch

    // Giphy
    var queryURLgiphy =
        "https://api.giphy.com/v1/gifs/search?api_key=x6F3pfxkqKMEhu2U8AOt2RK4zj0mgfdT" +
        "&q=" + search +
        "&limit=5"; // Only one gif
    $.ajax({
        url: queryURLgiphy,
        method: "GET",
    })
        .then(function (response) {
            var image = $("<img>")
            image.attr("src", response.data[0].images.fixed_height.url);
            $("#test").append("<br>");
            $("#test").append(image);
            $("#test").append("<br>");
        })

    // Musixmatch
    var queryURLmusix =
        "https://cors-anywhere.herokuapp.com/" +
        "https://api.musixmatch.com/ws/1.1/track.search?" +
        "q_lyrics=" + search +
        "&page_size=" + numberOfResults +
        "&apikey=9d4d23cdf5a7b47ec3b154fdd098501f";
    $.ajax({
        url: queryURLmusix,
        method: "GET",
    })
        .then(function (response1) {
            // response1 and data1 are used for this query
            // response2 and data2 are used for the snippet query
            var data1 = JSON.parse(response1);
            /*
            TWO ERRORS SO FAR:
            - Snippets sometimes fail to load
            - Second query processes AFTER for loop for some reason
            */
            for (i = 0; i < numberOfResults; i++) {
                var trackID = data1.message.body.track_list[i].track.track_id;
                var trackName = data1.message.body.track_list[i].track.track_name;
                var trackArtist = data1.message.body.track_list[i].track.artist_name;

                // Separate query for track.snippet.get method
                var queryURLsnippet =
                    "https://cors-anywhere.herokuapp.com/" +
                    "https://api.musixmatch.com/ws/1.1/track.snippet.get?" +
                    "track_id=" + trackID +
                    "&apikey=9d4d23cdf5a7b47ec3b154fdd098501f";
                $.ajax({
                    url: queryURLsnippet,
                    method: "GET",
                })
                    .then(function (response2) {
                        data2 = JSON.parse(response2);
                        var trackSnippet = data2.message.body.snippet.snippet_body;
                        $("#test").append("<br><b>" + trackSnippet + "</b><br>" + "\"" + trackName + "\"" + "<br>" + trackArtist + "<br>");
                        console.log(trackSnippet);
                    });
            }
        });
});
