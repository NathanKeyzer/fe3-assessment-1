var svg = d3.select("svg"), // svg in de HTML wordt
    margin = {top: 20, right: 20, bottom: 150, left: 150},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", function(d) {
  d.speakers = +d.speakers;
  return d;
}, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.language; })); // op de x as staat de taal
  y.domain([0, d3.max(data, function(d) { return d.speakers; })]); // op de y as staat het aantal mensen die de taal spreken

  g.append("g")
      .attr("class", "axis axis--x")// waardes die op de x as staan
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text") //zorgt ervoor dat de text van de x as geroteerd wordt
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)"
                });

  g.append("g")
      .attr("class", "axis axis--y") // waardes die op de y as staan
      .call(d3.axisLeft(y).ticks(10)) // aantal waardes op de y as
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -120)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Speakers")
      .attr("fill","steelblue")
      .attr("x", -2)
      ;

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.language); })
      .attr("y", function(d) { return y(d.speakers); })
      .attr("width", x.bandwidth())
      .attr("height", function(d) { return height - y(d.speakers); });
});
