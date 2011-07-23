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
    var latlng = new google.maps.LatLng(39.504041,-96.855469);
    var map = new google.maps.Map(document.getElementById("map_canvas"),{zoom: 4, center:latlng, mapTypeId: google.maps.MapTypeId.ROADMAP});

    inTheaterMovie($("#topMovieBox"));
    $("#ddBtn").click(function(){
        if ($("#topMovieBox").is(':visible')){
            $("#topMovieBox").slideUp("slow");
        } else {
            $("#topMovieBox").slideDown("slow");
        }
    });

    $("#miBtn").click(function(){
        if ($("#movieInfo").is(':visible')){
            $("#movieInfo").animate({width: "0px"}, 1000).hide();
            $("#miBtn").html("<");
        } else {
            $("#movieInfo").animate({width: "300px"}, 1000).show();
            $("#miBtn").html(">");
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
            var box = $("#movieInfo");
            box.html("");
            var poster = new Image();
            poster.src = rt.posters;
            box.append(poster);
            box.append("<div>" + rt.title + " (" + rt.year + ")</div>");
            box.append("<div class='small'>"+ rt.synopsis +"</div>")
            box.append("<div class='medium'>Runtime: " + rt.runtime + " min</div>" )
            box.append("<div class='medium'>Rating: " + rt.rating + "</div>")
            box.append("<ul id='castList' class='small'></ul>");
            var clist = $("#castList");
            for (var i in rt.mainCast){
                clist.append("<li>" + rt.mainCast[i]["name"] + " - " + rt.mainCast[i]["characters"][0] + "</li>");
            }
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
    searchTwitter(baseUrl + encodeURI(query) + '&geocode=' + pos.coords.latitude + ',' + pos.coords.longitude + ',20mi', map, 20);
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
