function searchtwitter(url) {
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
                search(searchBase + params + '&callback=?');
            });
        }
        else {
            $('#more').hide();
        }
    });
}