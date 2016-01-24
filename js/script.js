$(document).ready(function(){


  $('.filter li').click(function(event) {
    $('.graphs').empty();
    $('.filter li').removeClass('selected');
    $(event.target).addClass('selected');
    $('.graphs').append('<h3>' + $(event.target).text() + '</h3>');
    if ($(event.target).text() == "Award Winners") {
      // Award Winners Graph
      var margin = {top: 30, right: 30, bottom: 30, left: 30},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      // var parseDate = d3.time.format("%Y%m%d").parse;

      var x = d3.scale.linear()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var color = d3.scale.category10();

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .interpolate("basis")
          .x(function(d) { return x(d.days); })
          .y(function(d) { return y(d.commits); });

      var svg = d3.select(".graphs").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + (margin.left + 30) + "," + margin.top + ")");

      d3.tsv("data/awards.tsv", function(error, data) {
        if (error) throw error;

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "days"; }));

        data.forEach(function(d) {
          d.days = (d.days);
        });

        var cities = color.domain().map(function(name) {
          return {
            name: name,
            values: data.map(function(d) {
              return {days: d.days, commits: +d[name]};
            })
          };
        });

        x.domain(d3.extent(data, function(d) { return d.days; }));

        y.domain([
          d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.commits; }); }),
          d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.commits; }); })
        ]);

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
            .text("commits");

        var city = svg.selectAll(".city")
            .data(cities)
          .enter().append("g")
            .attr("class", "city");

        city.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

        city.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.days) + "," + y(d.value.commits) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
      });



    } else if ($(event.target).text() == "Team Size") {


      var margin = {top: 30, right: 30, bottom: 30, left: 30},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      // var parseDate = d3.time.format("%Y%m%d").parse;

      var x = d3.scale.linear()
          .range([0, width]);

      var y = d3.scale.linear()
          .range([height, 0]);

      var color = d3.scale.category10();

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left");

      var line = d3.svg.line()
          .interpolate("basis")
          .x(function(d) { return x(d.days); })
          .y(function(d) { return y(d.commits); });

      var svg = d3.select(".graphs").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + (margin.left + 30) + "," + margin.top + ")");

      d3.tsv("data/team_size_vs_git_log_10.tsv", function(error, data) {
        if (error) throw error;

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "days"; }));

        data.forEach(function(d) {
          d.days = (d.days);
        });

        var cities = color.domain().map(function(name) {
          return {
            name: name,
            values: data.map(function(d) {
              return {days: d.days, commits: +d[name]};
            })
          };
        });

        x.domain(d3.extent(data, function(d) { return d.days; }));

        y.domain([
          d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.commits; }); }),
          d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.commits; }); })
        ]);

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
            .text("commits");

        var city = svg.selectAll(".city")
            .data(cities)
          .enter().append("g")
            .attr("class", "city");

        city.append("path")
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); });

        city.append("text")
            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
            .attr("transform", function(d) { return "translate(" + x(d.value.days) + "," + y(d.value.commits) + ")"; })
            .attr("x", 3)
            .attr("dy", ".35em")
            .text(function(d) { return d.name; });
      });


    } else if ($(event.target).text() == "Average") {



      var margin = {top: 0, right: 40, bottom: 60, left: 40},
          width = 750,
          height = 500;

      var x = d3.scale.linear().range([0, width]);

      var y = d3.scale.linear().range([height, 0]);

      var xAxis = d3.svg.axis().scale(x).orient("bottom");

      var yAxis = d3.svg.axis().scale(y).orient("left");

      var line = d3.svg.line().x(function(d) { return x(d.days); }).y(function(d) { return y(d.values); });

      var svg = d3.select(".graphs").append("svg").attr("width", width).attr("height", height).append("g").attr("transform", "translate(" + (margin.left + 30) + "," + margin.top + ")");

      d3.tsv("data/overall_day_vs_git.tsv", type, function(error, data) {
        if (error) throw error;

        x.domain(d3.extent(data, function(d) { return d.days; }));
        y.domain([0, d3.max(data, function(d) { return +d.values; })]);

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
        // d.days = d.days;
        // d.values = d.values;
        return d;
      }
    }
  });


  $('.graphs svg').hide();
  $('.graphs h3').hide();
  $(".selected").click();

});