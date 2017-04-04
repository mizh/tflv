var margin = {right: 300};

var width = 960 - margin.right,
	barWidth = 600;
    barHeight = 100;

var x = d3.scaleLinear()
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width + margin.right);
    
var currDay = +"00000000";

d3.csv("tweets.csv", row, function(error, data) {
  x.domain([0, d3.max(data, function(d) { return d.tweet_id; })]);

  chart.attr("height", barHeight * data.length);

  var bar = chart.selectAll("g")
      .data(data)
    .enter().append("g")
      .filter(function(d) { return newDay(d.day); })
      .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
  
  bar.append("rect")
  	  .filter(function(d) { return newDay(d.day); })
      .attr("width", barWidth)
      .attr("height", barHeight - 1);
      
  bar.append("text")
  	  .filter(function(d) { return newDay(d.day); })
      .attr("x", barWidth + 10)
      .style("text-anchor", "start")
      .attr("y", barHeight / 2)
      .attr("dy", ".35em")
      .text(function(d) { return d.prettyDay; });
});

var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S %Z"),
	formatDay = d3.timeFormat("%m%d%Y"),
	formatPrettyDay = d3.timeFormat("%A %B %e, %Y"),
	formatYear = d3.timeFormat("%Y");

function row(d) {
  return {
  day: +formatDay(parseDate(d.timestamp)),
  prettyDay: formatPrettyDay(parseDate(d.timestamp)),
  tweet_id: +d.tweet_id 
};
}

function newDay(day) {
  if (day != currDay) {
    currDay = day;
    return true }
  else { return false };
}