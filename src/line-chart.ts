import * as d3 from "d3";

export function lineChart() {
  const margin = { top: 30, right: 0, bottom: 30, left: 50 };
  const width = document.body.clientWidth;
  const height = 300;
  const xRange = [margin.left, width - margin.right];
  const yRange = [height - margin.bottom, margin.top];
  // Construct scales and axes.
  const xScale = d3.scaleTime().range(xRange);
  const yScale = d3.scaleLinear().range(yRange);
  const formatTime = d3.timeFormat("%Y-%m-%d");

  const colors = [
    { name: "Good", min: 0, max: 50, color: "#9cd84e" },
    { name: "Moderate", min: 51, max: 100, color: "#facf39" },
    {
      name: "Unhealthy for Sensitive Groups",
      min: 101,
      max: 150,
      color: "#f99049",
    },
    { name: "Unhealthy", min: 151, max: 200, color: "#f65e5f" },
    { name: "Very Unhealthy", min: 201, max: 300, color: "#a070b6" },
    { name: "Hazardous", min: 301, color: "#a06a7b" },
  ];

  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40);

  // Create the SVG element for the chart.
  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  // Add the x axis
  svg
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", `translate(0,${height - margin.bottom})`);

  // Add the y axis
  svg
    .append("g")
    .attr("class", "yaxis")
    .attr("transform", `translate(${margin.left},0)`);

  const area = svg.append("path").attr("class", "area");
  // const tip = svg.select("body").append("div").attr("class", "tooltip");
  const tip = d3.select("body").append("div").attr("class", "tooltip");
  const line = svg.append("path").attr("class", "line");
  // const tooltip = svg.append('g').classed('tooltip', true)
  // .attr('transform',  `translate(${margin.left}, ${margin.top})`);

  const background = svg.append("g").attr("class", "background");
  const background1 = svg.append("g").attr("class", "background");
  const background2 = svg.append("g").attr("class", "background");
  const background3 = svg.append("g").attr("class", "background");

  function update1(
    X1: Int32Array,
    X2: Int32Array,
    Y1: Int32Array,
    Y2: Int32Array,
    Y3: Int32Array,
    Y4: Int32Array
  ) {
    const I = d3.range(X1.length);
    const I1 = d3.range(X2.length);

    xScale.domain([d3.min(X1) as number, d3.max(X1) as number]);
    yScale.domain([0, 160]);

    background
      .selectAll("rect")
      .data(colors)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", margin.bottom)
      .attr("width", width - margin.right - margin.left)
      .attr("height", 15)
      .attr("fill", "#f65e5f")
      .attr("opacity", 0.1);

    background1
      .selectAll("rect")
      .data(colors)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", 45)
      .attr("width", width - margin.right - margin.left)
      .attr("height", 75)
      .attr("fill", "#f99049")
      .attr("opacity", 0.1);

    background2
      .selectAll("rect")
      .data(colors)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", 120)
      .attr("width", width - margin.right - margin.left)
      .attr("height", 75)
      .attr("fill", "#facf39")
      .attr("opacity", 0.1);

    background3
      .selectAll("rect")
      .data(colors)
      .join("rect")
      .attr("x", margin.left)
      .attr("y", 195)
      .attr("width", width - margin.right - margin.left)
      .attr("height", 75)
      .attr("fill", "#9cd84e")
      .attr("opacity", 0.1);

    const a = d3
      .area<number>()
      .x((i) => xScale(X1[i]))
      .y0((i) => yScale(Y2[i]))
      .y1((i) => yScale(Y3[i]));

    area
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .attr("d", a(I))
      .attr("fill", "#cce5df");

    const l = d3
      .line<number>()
      .x((i) => xScale(X1[i]))
      .y((i) => yScale(Y1[i]))
      .curve(d3.curveMonotoneX);

    line
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .attr("d", l(I))
      .attr("opacity", 1)
      .style("fill", "none")
      .style("stroke", "black")
      .style("stroke-width", "2");

    svg
      .selectAll(".tooltip")
      .data(I)
      .enter()
      .append("circle")
      .attr("r", 1)
      .attr("cx", (i) => xScale(X1[i]))
      .attr("cy", (i) => yScale(Y1[i]))
      .on("mouseover", function (event, i) {
        tip.transition().duration(200).style("opacity", 0.9);
        tip
          .html(
            formatTime(new Date(X1[i])) + "<br/>" + "Mean US AQI" + " " + Y1[i]
          )
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        tip.transition().duration(500).style("opacity", 0);
      });

    // Clear the axis so that when we add the grid, we don't get duplicate lines
    svg.select(".xaxis").selectAll("*").remove();
    svg.select(".yaxis").selectAll("*").remove();
    svg.select(".line").selectAll("*").remove();
    svg.select(".area").selectAll("*").remove();
    svg.select(".tooltip").selectAll("*").remove();

    svg
      .select<SVGSVGElement>(".yaxis")
      .call(yAxis)
      // add gridlines
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("x2", width - margin.right - margin.left)
          .attr("stroke-opacity", 0.1)
      );

    svg.select<SVGSVGElement>(".xaxis").call(xAxis);

    d3.select<HTMLInputElement, unknown>("#myCheckbox").on(
      "change",
      function () {
        // This will be triggered when the user selects or unselects the checkbox
        // since we typed the select such that this is a HTMLInputElement we can just use the this context and have proper autocompletion
        const checked = this.checked;
        if (checked) {
          // Checkbox was just checked
          svg
            .selectAll("dots")
            .data(I1)
            .enter()
            .append("circle")
            .attr("class", "dots")
            .attr("cx", (i) => xScale(X2[i]))
            .attr("cy", (i) => yScale(Y4[i]))
            .attr("r", 1)
            .attr("opacity", 0.8)
            .attr("transform", "translate(" + 0 + "," + 0 + ")")
            .style("fill", "black");

          return {
            element: svg.node()!,
            update1,
          }; // Update the chart
        } else {
          // Checkbox was just unchecked
          return {
            element: svg.node()!,
            update1,
          }; // Update the chart with all the data we have
        }
      }
    ); //close the update function
  }

  return {
    element: svg.node()!,
    update1,
  };
} //close line chart
