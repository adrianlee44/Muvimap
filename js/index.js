var baseUrl = 'http://search.twitter.com/search.json?callback=?&q=';
var searchBase = 'http://search.twitter.com/search.json';
$(document).ready(function() {
    $('#title').hide();
    $('#more').hide();
    $('#search').width(200);
    $('#go').click(function() {
        var query = $('#search').val();
        $('.entries').html('');
        $('#locations').html('');
        search(baseUrl + encodeURI(query));
        $('#title').show().children('.movieTitle').html(query);
        $('#locations').append('<h1>Locations for ' + query + '</h2>');
    });
    $('#go').click();
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