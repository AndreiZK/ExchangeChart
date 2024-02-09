import {
  extent,
  scaleLinear,
  axisLeft,
  axisBottom,
  min,
  max,
  line,
  transition,
  zoom,
  svg,
} from "d3";

export const currencyChart = () => {
  let HEIGHT;
  let WIDTH;
  let DATA;
  let X_VALUE;
  let Y_VALUE;
  let CONNECTED = false;
  let MARGIN;
  let PATH_LENGTH;

  const my = (selection) => {
    // const myZoom = zoom().on('zoom', zoomed)
    // const calculateRange = (DATA, valueGetter) => [
    //   min(DATA, valueGetter) -
    //     (max(DATA, valueGetter) - min(DATA, valueGetter)) / 40,
    //   max(DATA, valueGetter) +
    //     (max(DATA, valueGetter) - min(DATA, valueGetter)) / 40,
    // ];

    const clip = selection
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", WIDTH)
      .attr("height", HEIGHT)
      .attr("fill", "black");

    const wrapper = selection
      .append("g")
      .attr(
        "transform",
        `translate(${MARGIN.inline / 2}, ${MARGIN.block / 2})`
      );

    const chartContainer = selection
      .append("g")
      .attr("clip-path", "url(#clip)")
      .attr(
        "transform",
        `translate(${MARGIN.inline / 2}, ${MARGIN.block / 2})`
      );

    const scatter = chartContainer.append("g").attr("class", "scatter");

    const x0 = extent(DATA, X_VALUE);
    const y0 = extent(DATA, Y_VALUE);

    const x = scaleLinear().domain(x0).range([0, WIDTH]).nice();

    const y = scaleLinear().domain(y0).range([HEIGHT, 0]).nice();

    const marks = DATA.map((d) => ({
      x: x(X_VALUE(d)),
      y: y(Y_VALUE(d)),
    }));

    // scatter
    //   .selectAll("circle")
    //   .data(DATA)
    //   .join("circle")
    //   .attr("cx", (d) => x(X_VALUE(d)))
    //   .attr("cy", (d) => y(Y_VALUE(d)))
    //   .attr("r", 5)
    //   .append("title")
    //   .text((d) => d.toString());

    scatter
      .selectAll("line.tick")
      .data(axisLeft(y).scale().ticks())
      .join("line")
      .attr("stoke-width", 1)
      .attr("stroke", "gray")
      .attr("class", "tick")
      .attr("x1", -1000)
      .attr("x2", WIDTH + 1000)
      .attr("transform", (d) => `translate(0, ${y(d)})`);

    const candlesticks = scatter
      .selectAll("g.candlestick")
      .data(DATA)
      .join("g")
      .attr("stroke-linecap", "round")
      .attr("transform", (d) => `translate(${x(X_VALUE(d))},0)`);

    candlesticks
      .append("line")
      .attr("y1", (d) => y(d.low))
      .attr("y2", (d) => y(d.high))
      .attr("stoke-width", 1)
      .attr("stroke", "black");

    candlesticks
      .append("line")
      .attr("y1", (d) => y(d.open))
      .attr("y2", (d) => y(d.avgClosing))
      .attr("stroke", (d) => (d.open > d.avgClosing ? "green" : "red"))
      .attr("stroke-width", WIDTH / DATA.length - WIDTH / DATA.length / 2)
      .append("title")
      .text(
        (d) => `
        Year: ${d.year}
        High: ${d.high}
        Low: ${d.low}
        Open: ${d.open}
        Close: ${d.avgClosing}
        % Change: ${d.percentChange}
      `
      );

    // scatter
    //   .selectAll("g.candlestick")
    //   .data(DATA)
    //   .join("g")
    //   .attr("class", "candlestick")
    //   .append("line")
    //   .attr("y1", (d) => y(d.open))
    //   .attr("y2", (d) => y(d.avgClosing))
    //   .attr("transform", (d) => `translate(${x(X_VALUE(d))},0)`)
    //   .attr("stroke", (d) => (d.open > d.avgClosing ? "green" : "red"))
    //   .attr("stroke-linecap", "round")
    //   .attr("stroke-width", 10);

    //AXES

    const xAxis = wrapper
      .selectAll("g.x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${HEIGHT})`)
      .call(axisBottom(x));

    const yAxis = wrapper
      .selectAll("g.y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      //   .attr("transform", `translate(${MARGIN.inline / 2}, 0)`)
      //   .transition()
      .call(axisLeft(y));

    //AXES LABELS

    // chartContainer
    //   .selectAll(".y-axis-label")
    //   .data([null])
    //   .join("text")
    //   .attr("x", 60)
    //   .attr("y", MARGIN.block + 15)
    //   .text((_) => "y axis label")
    //   .attr("class", "y-axis-label");

    // chartContainer
    //   .selectAll(".x-axis-label")
    //   .data([null])
    //   .join("text")
    //   .attr("x", WIDTH - MARGIN.inline - 100)
    //   .attr("y", HEIGHT - MARGIN.block - 15)
    //   .text((_) => "x axis label")
    //   .attr("class", "x-axis-label");

    //zooming logic

    const handleZoom = (e) => {
      scatter.attr("transform", e.transform);

      xAxis.call(axisBottom(x).scale(e.transform.rescaleX(x)));
      yAxis.call(axisLeft(y).scale(e.transform.rescaleY(y)));
    };

    const myZoom = zoom().scaleExtent([0.9, 2.5]).on("zoom", handleZoom);

    selection.call(myZoom);

    //CONNECTING LINE

    // const myLine = line()
    //   .x((d) => d.x)
    //   .y((d) => d.y);

    // const myLine = (data) => line()(data.map((d) => [d.x, d.y]));

    // const t = transition().duration(2000);

    // const path = chartContainer
    //   .selectAll(".connecting-line")
    //   .data([
    //     DATA.map((d) => ({
    //       x: x(X_VALUE(d)),
    //       y: y(Y_VALUE(d)),
    //     })),
    //   ])
    //   .join(
    //     (enter) =>
    //       enter
    //         .append("path")
    //         .attr("d", (d) => myLine(d))
    //         .each(function () {
    //           PATH_LENGTH = this.getTotalLength();
    //         })
    //         .attr("stroke-dasharray", PATH_LENGTH + " " + PATH_LENGTH)
    //         .attr("stroke-dashoffset", PATH_LENGTH)
    //         .call((enter) => enter.transition(t).attr("stroke-dashoffset", 0)),
    //     (update) =>
    //       update
    //         .each((d) => console.log(d))
    //         .attr("d", (d) => myLine(d))
    //         .each(function () {
    //           PATH_LENGTH = this.getTotalLength();
    //         })

    //         .attr("stroke-dasharray", PATH_LENGTH + " " + PATH_LENGTH)
    //         .attr("stroke-dashoffset", PATH_LENGTH)
    //         .call((update) =>
    //           update.transition(t).attr("stroke-dashoffset", 0)
    //         ),
    //     (exit) =>
    //       exit
    //         .call((exit) =>
    //           exit.transition(t).attr("stroke-dashoffset", PATH_LENGTH)
    //         )
    //         .remove()
    //   )
    //   .attr("stroke", "black")
    //   .attr("fill", "transparent")
    //   .attr("class", "connecting-line");

    // selection
    //   .append("path")
    //   .datum(marks)
    //   .attr("d", myLine)
    //   .attr("stroke", "black")
    //   .attr("fill", "transparent");

    // const linesData = marks.reduce((acc, d, i) => {
    //   const next = marks[i + 1];
    //   if (next)
    //     acc.push({
    //       x1: d.x,
    //       x2: marks[i + 1].x,
    //       y1: d.y,
    //       y2: marks[i + 1].y,
    //     });

    //   return acc;
    // }, []);

    // const lines = selection.append("g");
    // lines
    //   .selectAll("line")
    //   .data(linesData)
    //   .join("line")
    //   .attr("x1", (d) => d.x1)
    //   .attr("x2", (d) => d.x2)
    //   .attr("y1", (d) => d.y1)
    //   .attr("y2", (d) => d.y2)
    //   .attr("stroke", "black")
    //   .attr("display", CONNECTED ? "" : "none");
  };

  my.width = function (_) {
    return arguments.length ? ((WIDTH = +_), my) : WIDTH;
  };
  my.height = function (_) {
    return arguments.length ? ((HEIGHT = +_), my) : HEIGHT;
  };
  my.data = function (_) {
    return arguments.length ? ((DATA = _), my) : DATA;
  };
  my.xValue = function (_) {
    return arguments.length ? ((X_VALUE = _), my) : X_VALUE;
  };
  my.yValue = function (_) {
    return arguments.length ? ((Y_VALUE = _), my) : Y_VALUE;
  };
  my.connectMarks = function (_) {
    return arguments.length ? ((CONNECTED = _), my) : CONNECTED;
  };
  my.margin = function (_) {
    return arguments.length ? ((MARGIN = _), my) : MARGIN;
  };

  return my;
};
