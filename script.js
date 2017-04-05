var margin = {top:50, left:600, right: 600};

var width = 2000 - margin.right - margin.left,
	barWidth = 600;
	barHeight = 100;

var t = d3.scaleTime()
	.domain([new Date(1999,12,31,0,0,0), new Date(1999,12,31,23,59,59)])
	.range([0, barWidth]);

var chart = d3.select(".chart")
	.attr("width", width + margin.right + margin.left);

var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-8, 0])
	.html(function(d) { return d.text; });
chart.call(tip);

var currDay = +"00000000";
dayI = -1;

d3.csv("tweets.csv", row, function(error, data) {
	var bar = chart.selectAll("g")
		.data(data)
	.enter().append("g")
		.filter(function(d) { return newDay(d.day); })
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
  
	bar.append("rect")
		.attr("width", barWidth)
		.attr("height", barHeight - 1);
      
	bar.append("text")
		.attr("x", barWidth + 10)
		.style("text-anchor", "start")
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.text(function(d) { return d.prettyDay; });
      
	var dots = chart.selectAll("circle")
		.data(data)
	.enter().append("circle")
		.attr("transform", function(d) { return "translate(0," + newDayIndex(d.day) * barHeight + ")"; })
		.attr("cx", function(d) { return t(d.moment); })
		.attr("cy", barHeight / 2)
		.attr("r", 5)
		.on("mouseover", function(d) {
			tip.show(d);
			d3.select(this).attr("r", 10).style("fill", "red");
		})                  
		.on("mouseout", function(d) {
			tip.hide(d);
			d3.select(this).attr("r", 5).style("fill", "black");
		});
		
		chart.attr("height", barHeight * dayI - margin.top) 
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
});

var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S %Z"),
	second = d3.timeFormat("%S")
	minute = d3.timeFormat("%M")
	hour = d3.timeFormat("%H")
	formatDay = d3.timeFormat("%m%d%Y"),
	formatPrettyDay = d3.timeFormat("%A %B %e, %Y"),
	formatYear = d3.timeFormat("%Y");

function row(d) {
	return {
		moment: new Date(1999,12,31,+hour(parseDate(d.timestamp)),+minute(parseDate(d.timestamp)),+second(parseDate(d.timestamp))),
		day: +formatDay(parseDate(d.timestamp)),
		prettyDay: formatPrettyDay(parseDate(d.timestamp)),
		tweet_id: +d.tweet_id,
		text: cleanText(d.text)
		};
}

function newDay(day) {
	if (day != currDay) {
		currDay = day;
		return true }
	else { return false };
}

function newDayIndex(day) {
	if (day != currDay) {
		currDay = day;
		dayI = dayI + 1;
		return dayI }
	else { return dayI };
}

function cleanText(text) {
	var find = 'http(.*)';
	var re = new RegExp(find, 'g');
	text = text.replace(re, '');
	text = text.replace(/&amp;/g, '&');
	return text
}

function isNotReply(text) {
	return !text.includes("@")
}