var rtKey = "6gga7w7f7fmmebmuujqg6jdj";
var RTbaseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

var movieSearch = RTbaseUrl + "/movies.json?callback=?";
var reviewSearch = RTbaseUrl + '/movies/';

function loadRTreviews(movie){
    if (movie != '' && typeof(movie) != undefined){
        $.getJSON(movieSearch,{
            apikey: rtKey,
            q: movie
        }, function(json){
            var topChoice = json.movies[0];
            var mID = topChoice.id;
            console.log(mID);
            $.getJSON(reviewSearch + encodeURI(mID) + "/reviews.json?callback=?",{
                apikey: rtKey,
                page_limit: 50
            }, function(json){
                    console.log(json.reviews);
                }
            );
        });
    }
}
