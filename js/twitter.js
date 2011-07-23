var wordParserURL="http://landakram.webfactional.com/score?text=";

function searchTwitter(url, map, score, pages) {
    $.getJSON(url, function(json) {
        var locations = Array();
        $.each(json.results, function(i, tweet) {
            map.addTweet(tweet);
			if (tweet.geo != null) {
				$.getJSON(wordParserURL + encodeURI(tweet.text) + '&callback=?', function(json) {
					score.addScore(json);
					console.log('Score:' + score.returnScore());
				});
			}
        });
        $('#locations').append('<p>' + locations + '</p>');
        if (json.next_page != null) {
            console.log(json.next_page);
			var params = json.next_page + '';
			console.log(searchBase + params + '&callback=?');
			searchTwitter(searchBase + params + '&callback=?', map, score, pages - 1);
        }
        else {
            $('#more').hide();
        }
    });
}

function TwitterScore() {
	var sum = 0;
	var num_tweets = 0;
	this.addScore = function(json) {
		console.log("JSON SCORE:" + json.score);
		sum += (1-json.score) * 100;
		num_tweets++;
	}
	this.addScoreAttitude = function(json) {
		if (json.attitude == "positive" || json.attitude == "neutral") {
			sum++;
		}
		num_tweets++;
	}
	this.returnScore = function() {
		if (num_tweets == 0) {
			return 0;
		}
		return sum/num_tweets;
	}
}