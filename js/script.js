$(document).ready(function(){


  $('.filter li').click(function(event) {
    $('.graphs').empty();
    $('.filter li').removeClass('selected');
    $(event.target).addClass('selected');
    $('.graphs').append('<h3>' + $(event.target).text() + '</h3>');
    if ($(event.target).text() == "Award Winners") {
      // Award Winners Graph

      $('.graphs').append('<div><div class="legend" style="top: 60px;color: rgb(31, 119, 180);">No Awards</div><div class="legend" style="top: 85px;color: rgb(255, 127, 14);">1 Award</div><div class="legend" style="top: 110px;color: rgb(44, 160, 44);">2 Awards</div><div class="legend" style="top: 135px;color: rgb(214, 39, 40);">3 Awards</div><div class="legend" style="top: 160px;color: rgb(148, 103, 189);">4 Awards</div><div class="legend" style="top: 185px;color: rgb(140, 86, 75);">5 Awards</div><div class="legend" style="top: 210px;color: rgb(227, 119, 194);">6 Awards</div></div>');

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

      $('.graphs').append('<div><div class="legend" style="top: 60px;color: rgb(31, 119, 180);">Solo Project</div><div class="legend" style="top: 85px;color: rgb(255, 127, 14);">2-person</div><div class="legend" style="top: 110px;color: rgb(44, 160, 44);">3-person</div><div class="legend" style="top: 135px;color: rgb(214, 39, 40);">4-person</div></div>');

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

      d3.tsv("data/team_size_vs_git.tsv", function(error, data) {
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
    } else if ($(event.target).text() == "Using GitHub") {
      var svg = d3.select(".graphs")
        .append("svg")
        .append("g")

      svg.append("g")
        .attr("class", "slices");
      svg.append("g")
        .attr("class", "labels");
      svg.append("g")
        .attr("class", "lines");

      var width = 960,
          height = 450,
        radius = Math.min(width, height) / 2;

      var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
          return d.value;
        });

      var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);

      var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

      svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var key = function(d){ return d.data.label; };

      var color = d3.scale.ordinal()
        .domain(["Linked to Git Repo", "No Git Repo Link"])
        .range(["#009DD9", "#d94f5c"]);

      function randomData (){
        var labels = color.domain();
        return labels.map(function(label){
          if (label == "Linked to Git Repo")
            return { label: label, value: 3025 / 9726 }
          else
            return { label: label, value: 6701 / 9726 }
        });
      }

      change(randomData());

      d3.select(".randomize")
        .on("click", function(){
          change(randomData());
        });


      function change(data) {

        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
          .data(pie(data), key);

        slice.enter()
          .insert("path")
          .style("fill", function(d) { return color(d.data.label); })
          .attr("class", "slice");

        slice   
          .transition().duration(1000)
          .attrTween("d", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              return arc(interpolate(t));
            };
          })

        slice.exit()
          .remove();

        /* ------- TEXT LABELS -------*/

        var text = svg.select(".labels").selectAll("text")
          .data(pie(data), key);

        text.enter()
          .append("text")
          .attr("dy", ".35em")
          .text(function(d) {
            return d.data.label;
          });
        
        function midAngle(d){
          return d.startAngle + (d.endAngle - d.startAngle)/2;
        }

        text.transition().duration(1000)
          .attrTween("transform", function(d) {
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
              return "translate("+ pos +")";
            };
          })
          .styleTween("text-anchor", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? "start":"end";
            };
          });

        text.exit()
          .remove();

        /* ------- SLICE TO TEXT POLYLINES -------*/

        var polyline = svg.select(".lines").selectAll("polyline")
          .data(pie(data), key);
        
        polyline.enter()
          .append("polyline");

        polyline.transition().duration(1000)
          .attrTween("points", function(d){
            this._current = this._current || d;
            var interpolate = d3.interpolate(this._current, d);
            this._current = interpolate(0);
            return function(t) {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };      
          });
        
        polyline.exit()
          .remove();
      };
    } else if ($(event.target).text() == "Case Study: PennApps") {


      var margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 875 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var x0 = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1);

      var x1 = d3.scale.ordinal();

      var y = d3.scale.linear()
          .range([height, 0]);

      var color = d3.scale.ordinal()
          .range(["#D94F5C", "#009DD9", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

      var xAxis = d3.svg.axis()
          .scale(x0)
          .orient("bottom");

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickFormat(d3.format(".2s"));

      var svg = d3.select(".graphs").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
        .append("g")
          .attr("transform", "translate(" + (margin.left + 15) + "," + margin.top + ")");

      d3.tsv("data/pennapps_github_statistics.tsv", function(error, data) {
        if (error) throw error;

        var ageNames = d3.keys(data[0]).filter(function(key) { return key !== "hackathon"; });

        data.forEach(function(d) {
          d.ages = ageNames.map(function(name) { return {name: name, value: +d[name]}; });
        });

        x0.domain(data.map(function(d) { return d.hackathon; }));
        x1.domain(ageNames).rangeRoundBands([0, x0.rangeBand()]);
        y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

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
            .text("Submissions");

        var hackathon = svg.selectAll(".hackathon")
            .data(data)
          .enter().append("g")
            .attr("class", "hackathon")
            .attr("transform", function(d) { return "translate(" + x0(d.hackathon) + ",0)"; });

        hackathon.selectAll("rect")
            .data(function(d) { return d.ages; })
          .enter().append("rect")
            .attr("width", x1.rangeBand())
            .attr("x", function(d) { return x1(d.name); })
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .style("fill", function(d) { return color(d.name); });

        var legend = svg.selectAll(".legend")
            .data(ageNames.slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

      });


    }

    // var svgElement = document.querySelector('svg');
    // var panZoomTiger = svgPanZoom(svgElement);



  });


  $('.graphs svg').hide();
  $('.graphs h3').hide();
  $(".selected").click();

});