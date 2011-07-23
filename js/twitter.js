function searchTwitter(url, map, pages) {
    $.getJSON(url, function(json) {
        var locations = Array();
        $.each(json.results, function(i, tweet) {
            map.addTweet(tweet);
        });
        $('#locations').append('<p>' + locations + '</p>');
        if (json.next_page != null) {
            console.log(json.next_page);
			var params = json.next_page + '';
			console.log(searchBase + params + '&callback=?');
			searchTwitter(searchBase + params + '&callback=?', map, pages - 1);
        }
        else {
            $('#more').hide();
        }
    });
}
