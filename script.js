// Define basic dimensional chart variables:

var margin = {top:60, bottom:60, left:320, right: 100};

var width = 1600 - margin.right - margin.left,
	barWidth = 960,
	barHeight = 80,
	dotRadius = 4.7,
	dotOffset = 5,
	bigDotRadius = dotRadius * 1.5,
	buttonWidth = 160,
	buttonHeight = 40;

var chart = d3.select(".chart")
	.attr("width", width + margin.right + margin.left);

// Initialize time axes: 

var t = d3.scaleTime()
	.domain([new Date(1999,12,31,0,0,0), new Date(1999,12,31,23,59,59)])
	.range([0, barWidth]);

var mainAxis = d3.axisTop(t)
	.ticks(d3.timeHour.every(2))
	.tickFormat(d3.timeFormat("%H:%M"));
	
var bonusAxis = d3.axisTop(t)
	.ticks(d3.timeHour.every(2))
	.tickFormat(d3.timeFormat("%H:%M"));

// Enable tooltips using d3-tip: 

var tip = d3.tip()
	.attr("class", "d3-tip")
	.offset([-8, 0])
	.html(function(d) { return d; });
chart.call(tip);

// Initialize variables that will be modified by functions later: 

var currDay = +"00000000",
dayIndex = -1;
nDays = 0;
buttonIndex = 0;
filts = [];
colors = [];

// Read the data file: 
d3.csv("https://raw.githubusercontent.com/mizh/tflv/master/tweets_clean.csv", row, function(error, data) {
	
	// Draw a thick line for every day in the dataset: 
	
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
		
	chart.attr("height", barHeight * nDays + margin.top + margin.bottom) 
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	// Draw a time axis with ticks the height of the chart: 
	
	mainAxis.tickSizeInner(-barHeight * nDays);
	chart.append("g")
		.attr("class", "axis")
		.call(mainAxis);
	
	// Draw more time axes (without ticks) for easy interpretation: 
	
	var bonusAxes = chart.selectAll("axes")
		.data(data)
	.enter().append("g")
		.attr("class", "axis")
		.attr("transform", function(d, i) { return "translate(0," + (i+1)*7 * barHeight + ")"; })
		.call(bonusAxis);
	
	// Draw a dot for each tweet
	// that shows the text of the tweet on mouseover: 
	
	var dots = chart.selectAll("dot")
		.data(data)
	.enter().append("g");
	
	dots.append("circle")
		.attr("class", "dot")
		.attr("transform", function(d) { return "translate(0," + newDayIndex(d.day) * barHeight + ")"; })
		.attr("cx", function(d) { return t(d.moment); })
		.attr("cy", function(d, i) { if (i%2 == 0) { return barHeight/2 + dotOffset } else { return barHeight/2 - dotOffset }; })
		.attr("r", dotRadius)
		.style("fill", "black")
		.on("mouseover", function(d) {
			tip.show(wrap(d.text, 40, "<br>", false));
		})                  
		.on("mouseout", function(d) {
			tip.hide(d.text);
		});
	
	// Add buttons that highlight all dots associated with a specified food group: 
	
	foodFilters.forEach(function(f, i) {
		if (i%2 == 0) {buttonColor = "#555"}
		else {buttonColor = "#666"};
		newButton(f.label, f.regex_string, f.color, buttonColor);
	});
	
});

// Here is the object that specifies food groups of interest 
// and the colors we want to associate with them: 

var foodFilters = [
{
	"label": "coffee",
	"regex_string": "coffee",
	"color" : "#0074D9"
}, {
	"label": "tea",
	"regex_string": "tea",
	"color" : "blue"
}, {
	"label": "juice",
	"regex_string": "orange juice",
	"color" : "blueviolet"
}, {
	"label": "alcohol",
	"regex_string": "wine|beer",
	"color" : "darkgoldenrod"
}, {
	"label": "bread",
	"regex_string": "bread|toast",
	"color" : "#2ECC40"
}, {
	"label": "legumes",
	"regex_string": "bean|lentil|chickpea|hummus",
	"color" : "cadetblue"
}, {
	"label": "cereals",
	"regex_string": "buckwheat|quinoa|barley",
	"color" : "chocolate"
}, {
	"label": "seeds",
	"regex_string": "chia|hemp",
	"color" : "crimson"
}, {
	"label": "nuts",
	"regex_string": "almond|peanut",
	"color" : "#FF4136"
}, {
	"label": "margarine",
	"regex_string": "margarine",
	"color" : "#85144b"
}, {
	"label": "oil",
	"regex_string": "oil|evoo",
	"color" : "#F012BE"
}, {
	"label": "dairy",
	"regex_string": "cheese|cheddar|yogurt|cream|falafel",
	"color" : "#B10DC9"
}, {
	"label": "fish",
	"regex_string": "oyster|maki|tuna",
	"color" : "darkcyan"
}, {
	"label": "junk food",
	"regex_string": "fries|chips|cookies|burger",
	"color" : "darkgreen"
}, {
	"label": "chocolate",
	"regex_string": "chocolate",
	"color" : "darkmagenta"
}, {
	"label": "fresh fruit",
	"regex_string": "apple|banana|strawberr|kiwi|mango|watermelon|grapefruit|blueberr|avocado|fruit",
	"color" : "darkorange"
}, {
	"label": "processed fruit",
	"regex_string": "date|ginger|jam",
	"color" : "darkorchid"
}, {
	"label": "vegetables",
	"regex_string": "tomato|olive|carrot|pea |spinach|kale|cabbage|lettuce|seaweed|laver|cilantro|eggplant|veg|mushroom|radish|potato",
	"color" : "darkred"
}];

// Date and time calculations and parsing: 

var parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S %Z"),
	second = d3.timeFormat("%S")
	minute = d3.timeFormat("%M")
	hour = d3.timeFormat("%H")
	formatDay = d3.timeFormat("%m%d%Y"),
	formatPrettyDay = d3.timeFormat("%A %B %e, %Y"),
	formatYear = d3.timeFormat("%Y");

function row(d) {

// Pre-process data rows

	return {
		moment: new Date(1999,12,31,+hour(parseDate(d.timestamp)),+minute(parseDate(d.timestamp)),+second(parseDate(d.timestamp))),
		day: +formatDay(parseDate(d.timestamp)),
		prettyDay: formatPrettyDay(parseDate(d.timestamp)),
		tweet_id: +d.tweet_id,
		text: cleanText(d.text)
	};
}

function newDay(day) {

// Determine if the current day is a new day 

	if (day != currDay) {
		currDay = day;
		nDays = nDays + 1;
		return true }
	else { return false };
}

function newDayIndex(day) {

// Calculate the index of the current day

	if (day != currDay) {
		currDay = day;
		dayIndex = dayIndex + 1;
		return dayIndex }
	else { return dayIndex };
}

function cleanText(text) {

// Remove URLs from tweet text

	var find = 'http(.*)';
	var re = new RegExp(find, 'g');
	text = text.replace(re, '');
	text = text.replace(/&amp;/g, '&');
	return text
}

function wrap( str, width, brk, cut ) {

// Word wrap for the d3-tip tooltips

	brk = brk || 'n';
	width = width || 75;
	cut = cut || false;
	if (!str) { return str; }
	var regex = '.{1,' +width+ '}(\\s|$)';
	return str.match( RegExp(regex, 'g') ).join( brk );
}

function highlight(d, str, color) {

// Highlight dots associated with the food group specified in str

	re = new RegExp(str, "i");
	d3.selectAll(".dot")
		.filter(function(d) { return d.text.match(re); })
		.style("fill",color)
		.attr("r", bigDotRadius);
	filts.push(str);
	colors.push(color);
}

function unhighlight(d, str) {

// Unhighlight dots associated with the food group specified in str
// while preserving highlights on previously selected dots

	re = new RegExp(str, "i");
	
	var index = filts.indexOf(str);
	if (index > -1){
		filts.splice(index, 1);
		colors.splice(index, 1);
	};
	
	d3.selectAll(".dot")
		.filter(function(d) { return d.text.match(re); })
		.style("fill","black")
		.attr("r", dotRadius);
	
	filts.forEach( function(f, i) {
		re = new RegExp(f, "i");
		color = colors[i];
		d3.selectAll(".dot")
			.filter(function(d) { return d.text.match(re); })
			.style("fill",color)
			.attr("r", bigDotRadius);
	});
}

function newButton(label, regex_string, color, buttonColor) {

// Create a button that highlights all dots associated with a food group

	chart.append("rect")
		.datum(false)
		.attr("transform", "translate(" + (barWidth+20) + "," + (buttonIndex*buttonHeight) +")")
		.attr("width", buttonWidth)
		.attr("height", buttonHeight)
		.attr("rx",6)
		.attr("ry",6)
		.style("fill", buttonColor)
		.on("mouseover", function(d) { d3.select(this).style("fill", color); }) 
		.on("click", function(d) { 
			if (!d3.select(this).datum()) {
				highlight(d, regex_string, color); 
				d3.select(this).datum(!d3.select(this).datum());
			}
			else {
			unhighlight(d, regex_string);
			d3.select(this).style("fill", color)
				.datum(!d3.select(this).datum());
			}
		})
		.on("mouseout", function(d) { 
			if(!d3.select(this).datum()) { 
				d3.select(this).style("fill", buttonColor); 
			} 
			else {
				d3.select(this).style("fill", color)
			};
		});
		
	chart.append("text")
		.attr("transform", "translate(" + (barWidth+30) + "," + (buttonIndex*buttonHeight+25) +")")
		.text(label)
		.style("fill","white")
		.style("pointer-events","none");
		
	buttonIndex = buttonIndex + 1;
}