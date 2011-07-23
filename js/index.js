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
    $('#title').hide();
    $('#more').hide();
    $('#search').width(200);

    $('#go').click(function() {
        var query = $('#search').val();

        if (query == '' || typeof(query) == undefined) {
            return;
        }

        $('.entries').html('');
        $('#locations').html('');

        if ($('#localtweets').is(':checked')) {
            if (navigator.geolocation){
                navigator.geolocation.getCurrentPosition(function(pos) {
                    $('.movieTitle').append(' near (' + pos.coords.latitude + ', ' + pos.coords.longitude + ')');
                    locationBased(query, pos.coords);
               });
            } else {
                alert("Your browser does not support geolocation services. We cannot provide you with localized tweets.");
            }
        } else {
            searchtwitter(baseUrl + encodeURI(query));
        }

        // rotten tomatoes code
        $.getJSON(movieSearch,{
                apikey: rtKey,
                q: query
            }, function(data){
                rt = new rottenTomatoes(data);
                rt.init();
                console.log(rt);
            });

        $('#title').show().children('.movieTitle').html(query);
        $('#locations').append('<h1>Locations for ' + query + '</h2>');
    });
});

function locationBased(query, pos){
    // foursquare code
    $.getJSON(FS_venueSearch,{
        client_id: FS_client_id,
        client_secret: FS_client_secret,
        categoryId: "4bf58dd8d48988d17f941735",
        limit: 50,
        ll: pos.latitude + ',' + pos.longitude
    }, function(data){
        console.log(data);
    });

    // twitter code
    searchtwitter(baseUrl + encodeURI(query) + "&geocode=" + pos.latitude + ',' + pos.longitude + ',20mi');
}
