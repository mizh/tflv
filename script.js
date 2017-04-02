
var width = 960,
	height = 500;

var y = d3.scaleLinear()
	.range([height, 0]);

var chart = d3.select(".chart")
	.attr("width", width)
	.attr("height", height);

d3.csv("tweets.csv", type, function(error, data) {
	y.domain([0, d3.max(data, function(d) { return d.tweet_id; })]);

	var barWidth = width / data.length;

	var bar = chart.selectAll("g")
		.data(data)
	.enter().append("g")
		.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

	bar.append("rect")
		.attr("y", function(d) { return y(d.tweet_id); })
		.attr("height", function(d) { return height - y(d.tweet_id); })
		.attr("width", barWidth - 1);

	bar.append("text")
		.attr("x", barWidth / 2)
		.attr("y", function(d) { return y(d.tweet_id) + 3; })
		.attr("dy", ".75em")
		.text(function(d) { return d.tweet_id; });
});

function type(d) {
	d.tweet_id = +d.tweet_id; // coerce to number
	return d;
}
