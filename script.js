var margin = {right: 300};

var width = 960 - margin.right,
    barHeight = 20;

var x = d3.scaleLinear()
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width + margin.right);

d3.csv("tweets.csv", row, function(error, data) {
  x.domain([0, d3.max(data, function(d) { return d.tweet_id; })]);

  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

  bar.append("rect")
      .attr("width", function(d) { return x(d.tweet_id); })
      .attr("height", barHeight - 1);

  bar.append("text")
      .attr("x", function(d) { return x(d.tweet_id); })
      .style("text-anchor", "end")
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.day; });
});

var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S %Z"),
	formatDay = d3.timeFormat("%m-%d-%Y"),
	formatYear = d3.timeFormat("%Y");

function row(d) {
  return {
  day: formatDay(parseDate(d.timestamp)),
  tweet_id: +d.tweet_id 
};
}
