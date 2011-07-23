var baseUrl = 'http://search.twitter.com/search.json?callback=?&q=';
var searchBase = 'http://search.twitter.com/search.json';
var rtKey = "6gga7w7f7fmmebmuujqg6jdj";
var RTbaseUrl = "http://api.rottentomatoes.com/api/public/v1.0";
var movieSearch = RTbaseUrl + "/movies.json?callback=?";
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
        search(baseUrl + encodeURI(query));

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
        if ($('#localtweets').is(':checked')) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(pos) {
                    $('.movieTitle').append(' near (' + pos.coords.latitude + ', ' + pos.coords.longitude + ')');
                    search(baseUrl + encodeURI(query) + '&geocode=' + pos.coords.latitude + ',' + pos.coords.longitude + ',20mi');
                });
            }
            else {
                    alert("Your browser does not support geolocation services. We cannot provide you with localized tweets.");
            }
        }
        else {
            search(baseUrl + encodeURI(query));
        }
    });
});

function search(url) {
    $.getJSON(url, function(json) {
        var locations = Array();
        $.each(json.results, function(i, tweet) {
            $('.entries').append('<li class="entry"><img src="' + tweet.profile_image_url + '" width="48" height="48" />' + tweet.text + '</li>');
            if (tweet.geo != null) {
                locations.push(tweet.geo.coordinates);
            }
        });
        $('#locations').append('<p>' + locations + '</p>');
        if (json.next_page != null) {
            console.log(json.next_page);
            $('#more').show().click(function(e) {
                e.preventDefault();
                var params = json.next_page + '';
                console.log(searchBase + params + '&callback=?');
                search(searchBase + params + '&callback=?');
            });
        }
        else {
            $('#more').hide();
        }
    });
}