function searchTwitter(url, map, pages) {
    $.getJSON(url, function(json) {
        var locations = Array();
        $.each(json.results, function(i, tweet) {
            map.addTweet(tweet);
        });
        $('#locations').append('<p>' + locations + '</p>');
        if (json.next_page != null) {
            var params = json.next_page + '';
            searchTwitter(searchBase + params + '&callback=?', map, pages - 1);
        }
        else {
            $('#more').hide();
        }
    });
}
