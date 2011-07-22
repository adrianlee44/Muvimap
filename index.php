<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>Movie Trend</title>
		<link rel="stylesheet" href="css/reset.css">
		<link rel="stylesheet" href="css/grid.css">
		<link rel="stylesheet" href="css/style.css">
		
		<script type="text/javascript" src="js/jquery-1.6.2.min.js"></script>
		<script type="text/javascript" src="js/index.js"></script>
	</head>
	<body>
		<div id="content" class="container_12">
			<input type="text" id="search" /><button id="go">Go!</button><input type="checkbox" id="localtweets"/>Local tweets only
			<h1 id="title">Tweets about <span class='movieTitle'></span></h1>
			<ul class='entries'>
			</ul>
			<a href="#" id="more">next</a>
			<div id="locations"></div>
		</div>
		
	</body>
</html>