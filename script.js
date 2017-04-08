var margin = {top:60, bottom:60, left:320, right: 100};

var width = 1600 - margin.right - margin.left,
	barWidth = 960,
	barHeight = 80,
	dotRadius = 4.7,
	dotOffset = 5,
	bigDotRadius = dotRadius * 1.5;

var chart = d3.select(".chart")
	.attr("width", width + margin.right + margin.left);

var t = d3.scaleTime()
	.domain([new Date(1999,12,31,0,0,0), new Date(1999,12,31,23,59,59)])
	.range([0, barWidth]);

var mainAxis = d3.axisTop(t)
	.ticks(d3.timeHour.every(2))
	.tickFormat(d3.timeFormat("%H:%M"));
	
var bonusAxis = d3.axisTop(t)
	.ticks(d3.timeHour.every(2))
	.tickFormat(d3.timeFormat("%H:%M"));
	
var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-8, 0])
	.html(function(d) { return d; });
chart.call(tip);

var currDay = +"00000000",
dayI = -1;
nDays = -1;

d3.csv("tweets_clean.csv", row, function(error, data) {
	var bars = chart.selectAll("bar")
		.data(data)
	.enter().append("g")
		.filter(function(d) { return newDay(d.day); })
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
	
	bars.append("line")
		.attr("x1", -10)
		.attr("y1", function(d, i) { return barHeight/2; })
		.attr("x2", barWidth)
		.attr("y2", function(d, i) { return barHeight/2; });
      
	bars.append("text")
		.attr("x", -20)
		.style("text-anchor", "end")
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.text(function(d) { return d.prettyDay; });
		
	chart.attr("height", barHeight * (nDays+1) + margin.top + margin.bottom) 
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		
	mainAxis.tickSizeInner(-barHeight * (nDays+1) + barHeight/2 - 20);
	chart.append("g")
		.attr("class", "axis")
		.call(mainAxis);
		
	var bonusAxes = chart.selectAll("axes")
		.data(data)
	.enter().append("g")
		.attr("class", "axis")
		.attr("transform", function(d, i) { return "translate(0," + (i+1)*7 * barHeight + ")"; })
		.call(bonusAxis);
				      
	var dots = chart.selectAll("dot")
		.data(data)
	.enter().append("g");
	
	dots.append("circle")
		.attr("class", "dot")
		.attr("transform", function(d) { return "translate(0," + newDayIndex(d.day) * barHeight + ")"; })
		.attr("cx", function(d) { return t(d.moment); })
		.attr("cy", function(d, i) { if (i%2 == 0) { return barHeight/2 + dotOffset } else { return barHeight/2 - dotOffset }; })
		.attr("r", dotRadius)
		//.style("fill", function(d) { return foodColor(d.text); })
		.style("fill", "black")
		.on("mouseover", function(d) {
			tip.show(wrap(d.text, 40, "<br>", false));
		})                  
		.on("mouseout", function(d) {
			tip.hide(d.text);
		});

	d3.select("#buttons")
		.append("button")
		.text("coffee")
    	.on("click", function(d) { highlight(d, "coffee") });

	d3.select("#buttons")
		.append("button")
		.text("cheese")
    	.on("click", function(d) { highlight(d, "cheddar|cheese") });
    	
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
		nDays = nDays + 1;
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

function wrap( str, width, brk, cut ) {
	brk = brk || 'n';
	width = width || 75;
	cut = cut || false;
	if (!str) { return str; }
	var regex = '.{1,' +width+ '}(\\s|$)';
	return str.match( RegExp(regex, 'g') ).join( brk );
}

function foodColor(text) {
	if (text.match(/coffee/i)) {
	return "saddlebrown" }
	else if (text.match(/tea/i)) {
	return "darkkhaki" }
	else if (text.match(/toast|bean|lentil|quinoa/i)) {
	return "peru" }
	else if (text.match(/cheese|cheddar|yogurt/i)) {
	return "yellow" }
	else if (text.match(/almond|chia|date/i)) {
	return "steelblue" }
	else if (text.match(/orange juice/i)) {
	return "darkorange" }
	else if (text.match(/banana|apple|kiwi|mango|avocado|watermelon|strawberr|fruit/i)) {
	return "mediumvioletred" }
	else if (text.match(/tomato|onion|seaweed|laver|olive|pea|salad/i)) {
	return "seagreen" }
	else if (text.match(/chocolate|ginger/i)) {
	return "hotpink" }
	else {
	return "black"
	};
}

function highlight(d, str) {
	re = new RegExp(str, "i");
	d3.selectAll(".dot")
		.style("fill","black")
		.attr("r", dotRadius)
		.filter(function(d) { return d.text.match(re); })
		.style("fill","yellow")
		.attr("r", bigDotRadius);
}
