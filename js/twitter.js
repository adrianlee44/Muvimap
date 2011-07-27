var wordParserURL="http://landakram.webfactional.com/score?callback=?";

function searchTwitter(url, map, score, pages) {
    $.getJSON(url, function(json) {
        $.each(json.results, function(i, tweet) {
            if (tweet.geo != null && tweet.text != '' && tweet.text != undefined) {
            	map.addTweet(tweet);
                $.getJSON(wordParserURL,{
                	text: encodeURI(tweet.text)
                }, function(data) {
                    score.addScore(data);
                });
            }
        });
        if (json.next_page != null) {
            var params = json.next_page + '';
            searchTwitter(searchBase + params + '&callback=?', map, score, pages - 1);
        }
    });
}

function TwitterScore() {
    var sum = 0;
    var num_tweets = 0;
    this.addScore = function(json) {
        sum += (1-json.score) * 100;
        num_tweets++;
        $("#twitterS").html("Twitter: " + this.returnScore().toFixed(2));
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
