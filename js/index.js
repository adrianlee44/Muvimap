var searchBase = 'http://search.twitter.com/search.json';
var baseUrl = 'http://search.twitter.com/search.json?callback=?&q=';
var rtKey = "6gga7w7f7fmmebmuujqg6jdj";
var RTbaseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
var movieSearch = RTbaseUrl + "/movies.json?callback=?";

var FS_client_id = "5AUSSGFLLZICUYW3HG05RZBIGJM4GBDZX3SB5ZWENKVVNRPJ";
var FS_client_secret = "ZDPED2SBDVSP0QDSURWZTJB3S2NLM3VGJDXF1W4H0DAWPHB2";
var FS_venueSearch = "https://api.foursquare.com/v2/venues/search"
var rt;

$(document).ready(function() {
    var _GET = getUrlVars();
    var localpos = {};
    //Somewhere in Kansas
    var latlng = new google.maps.LatLng(39.504041,-96.855469);
    var map = new google.maps.Map(document.getElementById("map_canvas"),{zoom: 4, center:latlng, mapTypeId: google.maps.MapTypeId.ROADMAP});

    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos) {
            localpos = pos;
       });
    } else {
        alert("Your browser does not support geolocation services. We cannot provide you with localized tweets.");
    }

	// UI code
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

    if (_GET['q'] != '' && typeof(_GET['q']) != undefined && _GET['q'] != undefined){
        processMovie(decodeURI(_GET['q']), localpos);
    }

    $('#searchBtn').click(function() {
        var query = $('#search').val();
        if (query == '' || typeof(query) == undefined) {
            return;
        }
        processMovie(query, localpos);
    });
});

function processMovie(movie, tpos){
    if (tpos.coords==undefined && navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos) {
        	locationBased(movie, pos);
       });
    } else {
    	locationBased(movie, tpos);
    }
    

    // rotten tomatoes code
    $.getJSON(movieSearch,{
            apikey: rtKey,
            q: movie
        }, function(data){
            rt = new rottenTomatoes(data);
            rt.init();
			showMovieInfo(rt);
        });
}

function showMovieInfo(obj){
    var box = $("#movieInfo");
    box.html("");
    var poster = new Image();
    poster.src = obj.posters;
    box.append("<div id='posterScore'><div id='posterImg'></div><div id='scoresInfo'><span id='twitterS'></span><br /><span id='rtS'></span></div><div class='clear'></div></div>");
    $("#posterImg").append(poster);
    box.append("<div id='movietName'>" + obj.title + " (" + obj.year + ")</div>");
    box.append("<div class='small'>"+ obj.synopsis +"</div>")
    box.append("<div class='medium'>Runtime: " + obj.runtime + " min</div>" )
    box.append("<div class='medium'>Rating: " + obj.rating + "</div>")
    box.append("<ul id='castList' class='small'></ul>");
    var clist = $("#castList");
    for (var i in obj.mainCast){
        clist.append("<li>" + obj.mainCast[i]["name"] + " - " + obj.mainCast[i]["characters"][0] + "</li>");
    }
    $("#rtS").html("RottenTomates: " + obj.score);
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
    var map = new GoogleMap(document.getElementById("map_canvas"), pos.coords.latitude, pos.coords.longitude);
    var score = new TwitterScore();
    searchTwitter(baseUrl + encodeURI(query) + '&geocode=' + pos.coords.latitude + ',' + pos.coords.longitude + ',20mi', map, score, 20);

}