function GoogleMap(element,lat, lng) {
    var currentPos = new google.maps.LatLng(lat, lng);
    var myOptions = {
		zoom: 8,
		center: currentPos,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(element, myOptions);
	// Put a You are Here marker
	var hereMarker = new google.maps.Marker({
		position: currentPos,
		map: map,
		title:"You are here!",
		icon: "images/my_location.png"
	});
	var hereInfo = new google.maps.InfoWindow({
		content: "You are here!"
	});
	google.maps.event.addListener(hereMarker, 'click', function() {
		hereInfo.open(map, hereMarker);
	});
	this.addTweet = function(tweet) {
		if (tweet.geo != null) {
			var tweetPos = new google.maps.LatLng(tweet.geo.coordinates[0], tweet.geo.coordinates[1]);
			var tweetMarker = new google.maps.Marker({
				position: tweetPos,
				map: map,
				title:tweet.from_user
			});
			var tweetInfo = new google.maps.InfoWindow({
				content: '<b>' + tweet.from_user + '</b></br><img src="' + tweet.profile_image_url + '" width="48" height="48" /></br>' + tweet.text
			});
			google.maps.event.addListener(tweetMarker, 'click', function() {
				tweetInfo.open(map, tweetMarker);
			});
		}
	}
}