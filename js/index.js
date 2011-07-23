var baseUrl = 'http://search.twitter.com/search.json?callback=?&q=';
var searchBase = 'http://search.twitter.com/search.json';
var rtKey = "6gga7w7f7fmmebmuujqg6jdj";
var RTbaseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
var movieSearch = RTbaseUrl + "/movies.json?callback=?";

var FS_client_id = "5AUSSGFLLZICUYW3HG05RZBIGJM4GBDZX3SB5ZWENKVVNRPJ";
var FS_client_secret = "ZDPED2SBDVSP0QDSURWZTJB3S2NLM3VGJDXF1W4H0DAWPHB2";
var FS_venueSearch = "https://api.foursquare.com/v2/venues/search"

var rt;

$(document).ready(function() {
    var _GET = getUrlVars();
    console.log(_GET["q"]);

    $('#title').hide();

    inTheaterMovie($("#topMovieBox"));
    $("#ddBtn").click(function(){
        if ($("#topMovieBox").is(':visible')){
            $("#topMovieBox").slideUp("slow");
        } else {
            $("#topMovieBox").slideDown("slow");
        }
    });

    if (_GET['q'] != '' && typeof(_GET['q']) != undefined){
        processMovie(decodeURI(_GET['q']));
    }

    $('#searchBtn').click(function() {
        var query = $('#search').val();
        if (query == '' || typeof(query) == undefined) {
            return;
        }
        processMovie(query);
    });
});

function processMovie(movie){
    $('.entries').html('');
    $('#locations').html('');
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos) {
            $('.movieTitle').append(' near (' + pos.coords.latitude + ', ' + pos.coords.longitude + ')');
            locationBased(movie, pos);
       });
    } else {
        alert("Your browser does not support geolocation services. We cannot provide you with localized tweets.");
    }

    // rotten tomatoes code
    $.getJSON(movieSearch,{
            apikey: rtKey,
            q: movie
        }, function(data){
            rt = new rottenTomatoes(data);
            rt.init();
            console.log(rt);
        });

    $('#title').show().children('.movieTitle').html(movie);
    $('#locations').append('<h1>Locations for ' + movie + '</h2>');
}

function locationBased(query, pos){
    // foursquare code
    $.getJSON(FS_venueSearch,{
        client_id: FS_client_id,
        client_secret: FS_client_secret,
        categoryId: "4bf58dd8d48988d17f941735",
        limit: 50,
        ll: pos.coords.latitude + ',' + pos.coords.longitude
    }, function(data){
        console.log(data);
    });

    // twitter code
    $('.movieTitle').append(' near (' + pos.coords.latitude + ', ' + pos.coords.longitude + ')');
    var map = new GoogleMap(document.getElementById("map_canvas"), pos.coords.latitude, pos.coords.longitude);
    searchTwitter(baseUrl + encodeURI(query) + '&geocode=' + pos.coords.latitude + ',' + pos.coords.longitude + ',20mi', map);
}

// Read a page's GET URL variables and return them as an associative array.
function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}
