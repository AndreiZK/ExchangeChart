import "./style.css";
import { csv, line, select } from "d3";

import { currencyChart } from "./currencyChart.js";

// const title = document.createElement("h1");

// title.textContent = "Gold Prices By Year Starting 1969";
// document.body.prepend(title);

const DATA_URL =
  "https://raw.githubusercontent.com/AndreiZK/data/main/gold_price_yearly.csv";

const parseRow = (d) => {
  const formatted = {};

  formatted.year = +d["Year"];
  formatted.avgClosing = +d["Average Closing Price"];
  formatted.open = +d["Year Open"];
  formatted.high = +d["Year High"];
  formatted.low = +d["Year Low"];
  formatted.percentChange = +d["Annual % Change"];

  return formatted;
};

const margin = {
  block: 50,
  inline: 100,
};

const width = window.innerWidth / 1.5 - margin.inline;
const height = window.innerHeight / 2 - margin.block;

const svg = select("#app")
  .append("svg")
  .attr("width", width + margin.inline)
  .attr("height", height + margin.block);

// const menuContainer = select("#app")
//   .append("div")
//   .attr("class", "menu-container");

// const lineToggleBtn = select("#app")
//   .append("button")
//   .text("toggle connecting line");

const main = async () => {
  let lineOn = false;

  const chart = currencyChart()
    .height(height)
    .width(width)
    .margin(margin)
    .data(await csv(DATA_URL, parseRow))
    .xValue((d) => d.year)
    .yValue((d) => d.open)
    .connectMarks(lineOn);

  // const options = [
  //   { value: "open", text: "Price" },
  //   { value: "percentChange", text: "Annual % Price Change" },
  // ];

  // menuContainer
  //   .selectAll("label")
  //   .data([null])
  //   .join("label")
  //   .attr("for", "data-select")
  //   .text("Data to show");

  // menuContainer
  //   .selectAll("select")
  //   .data([null])
  //   .join("select")
  //   .attr("id", "data-select")
  //   .on("change", (e) => {
  //     svg.call(chart.yValue((d) => d[e.target.value]));
  //   })
  //   .selectAll("option")
  //   .data(options)
  //   .join("option")
  //   .attr("value", (d) => d.value)
  //   .text((d) => d.text);

  // lineToggleBtn.on("click", () => {
  //   lineOn = !lineOn;
  //   svg.call(chart.connectMarks(lineOn));
  // });

  svg.call(chart);
};

main();
