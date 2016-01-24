$(document).ready(function(){

  $('.filter li').click(function(event) {
    $('.filter li').removeClass('selected');
    $(event.target).addClass('selected');
  });

// var svg = d3.select("#gitActivity")
//   .append("svg")
//   .append("g")

// svg.append("g")
//   .attr("class", "slices");
// svg.append("g")
//   .attr("class", "labels");
// svg.append("g")
//   .attr("class", "lines");

// var width = 960,
//     height = 450,
//   radius = Math.min(width, height) / 2;

// var pie = d3.layout.pie()
//   .sort(null)
//   .value(function(d) {
//     return d.value;
//   });

// var arc = d3.svg.arc()
//   .outerRadius(radius * 0.8)
//   .innerRadius(radius * 0.4);

// var outerArc = d3.svg.arc()
//   .innerRadius(radius * 0.9)
//   .outerRadius(radius * 0.9);

// svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// var key = function(d){ return d.data.label; };

// var color = d3.scale.ordinal()
//   .domain(["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"])
//   .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// function randomData (){
//   var labels = color.domain();
//   return labels.map(function(label){
//     return { label: label, value: Math.random() }
//   });
// }

// change(randomData());

// d3.select(".randomize")
//   .on("click", function(){
//     change(randomData());
//   });


// function change(data) {

//   /* ------- PIE SLICES -------*/
//   var slice = svg.select(".slices").selectAll("path.slice")
//     .data(pie(data), key);

//   slice.enter()
//     .insert("path")
//     .style("fill", function(d) { return color(d.data.label); })
//     .attr("class", "slice");

//   slice   
//     .transition().duration(1000)
//     .attrTween("d", function(d) {
//       this._current = this._current || d;
//       var interpolate = d3.interpolate(this._current, d);
//       this._current = interpolate(0);
//       return function(t) {
//         return arc(interpolate(t));
//       };
//     })

//   slice.exit()
//     .remove();

//    ------- TEXT LABELS -------

//   var text = svg.select(".labels").selectAll("text")
//     .data(pie(data), key);

//   text.enter()
//     .append("text")
//     .attr("dy", ".35em")
//     .text(function(d) {
//       return d.data.label;
//     });
  
//   function midAngle(d){
//     return d.startAngle + (d.endAngle - d.startAngle)/2;
//   }

//   text.transition().duration(1000)
//     .attrTween("transform", function(d) {
//       this._current = this._current || d;
//       var interpolate = d3.interpolate(this._current, d);
//       this._current = interpolate(0);
//       return function(t) {
//         var d2 = interpolate(t);
//         var pos = outerArc.centroid(d2);
//         pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
//         return "translate("+ pos +")";
//       };
//     })
//     .styleTween("text-anchor", function(d){
//       this._current = this._current || d;
//       var interpolate = d3.interpolate(this._current, d);
//       this._current = interpolate(0);
//       return function(t) {
//         var d2 = interpolate(t);
//         return midAngle(d2) < Math.PI ? "start":"end";
//       };
//     });

//   text.exit()
//     .remove();

//   /* ------- SLICE TO TEXT POLYLINES -------*/

//   var polyline = svg.select(".lines").selectAll("polyline")
//     .data(pie(data), key);
  
//   polyline.enter()
//     .append("polyline");

//   polyline.transition().duration(1000)
//     .attrTween("points", function(d){
//       this._current = this._current || d;
//       var interpolate = d3.interpolate(this._current, d);
//       this._current = interpolate(0);
//       return function(t) {
//         var d2 = interpolate(t);
//         var pos = outerArc.centroid(d2);
//         pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
//         return [arc.centroid(d2), outerArc.centroid(d2), pos];
//       };      
//     });
  
//   polyline.exit()
//     .remove();
// };







// var margin = {top: 0, right: 40, bottom: 60, left: 40},
//     width = 750,
//     height = 500 - margin.top - margin.bottom;

// var parseDate = d3.time.format("%Y%m%d").parse;

// var x = d3.time.scale()
//     .range([0, width]);

// var y = d3.scale.linear()
//     .range([height, 0]);

// var color = d3.scale.category10();

// var xAxis = d3.svg.axis()
//     .scale(x)
//     .orient("bottom");

// var yAxis = d3.svg.axis()
//     .scale(y)
//     .orient("left");

// var line = d3.svg.line()
//     .interpolate("basis")
//     .x(function(d) { return x(d.date); })
//     .y(function(d) { return y(d.temperature); });

// var svg = d3.select("#gitActivity").append("svg")
//     .attr("width", width)
//     .attr("height", height)
//   .append("g")
//     .attr("transform", "translate(" + margin.left+ ", 0)");

// d3.tsv("data.tsv", function(error, data) {
//   if (error) {
//     throw error; 
//   }

//   color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

//   data.forEach(function(d) {
//     d.date = parseDate(d.date);
//   });

//   var cities = color.domain().map(function(name) {
//     return {
//       name: name,
//       values: data.map(function(d) {
//         return {date: d.date, temperature: +d[name]};
//       })
//     };
//   });

//   x.domain(d3.extent(data, function(d) { return d.date; }));

//   y.domain([
//     d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
//     d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
//   ]);

//   svg.append("g")
//       .attr("class", "x axis")
//       .attr("transform", "translate(0," + height + ")")
//       .call(xAxis);

//   svg.append("g")
//       .attr("class", "y axis")
//       .call(yAxis);
//     // .append("text")
//     //   .attr("transform", "rotate(-90)")
//     //   .attr("y", 6)
//     //   .attr("dy", ".71em")
//     //   .style("text-anchor", "end")
//     //   .text("Temperature (ºF)");

//   var city = svg.selectAll(".city")
//       .data(cities)
//     .enter().append("g")
//       .attr("class", "city");

//   city.append("path")
//       .attr("class", "line")
//       .attr("d", function(d) { return line(d.values); })
//       .style("stroke", function(d) { return color(d.name); });

//   city.append("text")
//       .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
//       .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
//       .attr("x", 3)
//       .attr("dy", ".35em")
//       .text(function(d) { return d.name; });
// });
























var margin = {top: 0, right: 40, bottom: 60, left: 40},
    width = 750,
    height = 500;

var x = d3.scale.linear().range([0, width]);

var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left");

var line = d3.svg.line().x(function(d) { return x(d.timeS); }).y(function(d) { return y(d.commits); });

var svg = d3.select("#gitActivity").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data/generalGit.tsv", type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.timeS; }));
  y.domain(d3.extent(data, function(d) { return d.commits; }));

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Commits");

  svg.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line);
});

function type(d) {
  // d.date = formatDate.parse(d.date);
  d.timeS = parseInt(d.timeS);
  d.commits = d.commits;
  return d;
}


});