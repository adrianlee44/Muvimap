function rottenTomatoes(json){
    var self = {};
    var _ = {};

    _.rtKey = "6gga7w7f7fmmebmuujqg6jdj";
    _.RTbaseUrl = "http://api.rottentomatoes.com/api/public/v1.0";

    _.movieSearch = _.RTbaseUrl + "/movies.json?callback=?";
    _.reviewSearch = _.RTbaseUrl + '/movies/';

    _.mjson = json;

    self.ID = "";
    self.rating = "";
    self.posters = "";
    self.mainCast = {};
    self.critic = "";
    self.runtime = "";
    self.title = "";
    self.year = "";
    self.releaseDate = "";
    self.score = 0;
    self.reviewJson = [];

    self.init = function(){
        var first = _.mjson.movies[0];
        self.ID = first.id;
        self.rating = first.mpaa_rating;
        self.posters = first.posters.original;
        self.mainCast = first.abridged_cast;
        self.critic = first.critics_consensus;
        self.runtime = first.runtime;
        self.title = first.title;
        self.year = first.year;
        self.releaseDate = first.release_dates.theater;
        var reviewsURL = _.RTbaseUrl+"/movies/"+self.ID+"/reviews.json?review_type=all&page_limit=50&country=us&page=1&callback=?&apikey="+_.rtKey
        self.loadRTreviews(reviewsURL);
    }

    self.loadRTreviews = function(url){
        if (url != '' && typeof(url) != undefined){
            $.getJSON(url, function(data){
                console.log(data);
                _.scoreMovie(data.reviews);
                self.reviewJson = self.reviewJson.concat(data.reviews);
                if (data.links.next!=""){
                    self.loadRTreviews(data.links.next+"&apikey="+_.rtKey+"&callback=?");
                }
            });
        }
    }

    _.scoreMovie = function(reviews){
        if (reviews.length <= 0) {
            return 0;
        }
        $.each(reviews, function(i, review){
            if (review.freshness == "fresh"){
                self.score++;
            } else {
                self.score--;
            }
        });
    }

    return self;
}