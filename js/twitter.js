function searchTwitter(url, map) {
    $.getJSON(url, function(json) {
        var locations = Array();
        $.each(json.results, function(i, tweet) {
            map.addTweet(tweet);
        });
        $('#locations').append('<p>' + locations + '</p>');
        if (json.next_page != null) {
            console.log(json.next_page);
            $('#more').show().click(function(e) {
                e.preventDefault();
                var params = json.next_page + '';
                console.log(searchBase + params + '&callback=?');
                searchTwitter(searchBase + params + '&callback=?', map);
            });
        }
        else {
            $('#more').hide();
        }
    });
}
