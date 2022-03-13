import {
  axisBottom,
  extent,
  max,
  scaleLinear,
  scaleTime,
  timeFormat,
  select,
  line,
  axisRight,
  area,
  format,
  min,
} from "d3";
import React, { useEffect, useRef } from "react";
import useResizeObserver from "@utils/useResizeObserver";
import { BuzzWrapper } from "./style";
import useDebounce from "@utils/useDebounce";

const data = [
  { date: new Date("2018-01-01"), value: 3 },
  { date: new Date("2018-01-02"), value: 2 },
  { date: new Date("2018-01-03"), value: 6 },
  { date: new Date("2018-01-04"), value: 2 },
  { date: new Date("2018-01-05"), value: 2 },
  { date: new Date("2018-01-06"), value: 1 },
  { date: new Date("2018-01-07"), value: 3 },
  { date: new Date("2018-01-08"), value: 5 },
];

const BuzzChart = ({
  width = 500,
  height = 300,
  marginTop = 40,
  marginBottom = 40,
  marginLeft = 40,
  marginRight = 40,
  padding = 0,
}) => {
  const buzzChartRef = useRef();
  const svgRef = useRef(null);
  const dimensions = useResizeObserver(buzzChartRef);
  const resize = useDebounce(dimensions, 200);

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll(".buzzg").remove();

    if (!resize) return;

    const { width, height } = resize;
    svg.attr("width", width).attr("height", height);

    const xScale = scaleTime()
      .domain(extent(data, (data) => data.date))
      .range([marginLeft, width - marginLeft]);

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat(timeFormat("%m-%d"));
    // .tickSizeOuter(0);

    svg
      .select(".title")
      .attr("x", marginLeft)
      .attr("y", marginBottom - 10);

    svg
      .select(".x-axis")
      .call(xAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .style("transform", `translateY(${height - marginBottom}px)`);

    const maxValue = max(data, (data) => data.value);

    const yScale = scaleLinear()
      .domain([0, maxValue])
      .nice()
      .range([height - marginBottom, marginTop]);

    const yAxis = axisRight(yScale)
      .tickValues([0, maxValue / 2, maxValue])
      .tickFormat(format("d"));

    svg
      .select(".y-axis")
      .call(yAxis)
      .style("transform", `translateX(${marginLeft}px)`)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll("line")
          .attr("x1", 0)
          .attr("x2", width - marginRight - marginLeft),
      )
      .call((g) => {
        g.selectAll(".tick text").style(
          "transform",
          `translateX(${width - marginLeft - marginRight}px)`,
        );
      });

    const chartLine = line()
      .defined((d) => !isNaN(d.value))
      .x((d) => xScale(d.date))
      .y((d) => yScale(d.value));

    const chartArea = area()
      .x((d) => xScale(d.date))
      .y0(() => yScale(0))
      .y1((d) => yScale(d.value));

    svg
      .selectAll(".buzzg")
      .data([data])
      .join((enter) => {
        const buzzg = enter.append("g").classed("buzzg", true);

        buzzg
          .append("path")
          .classed("buzzarea", true)
          .attr("d", (data) => chartLine(data))
          .attr("d", (data) => chartArea(data));

        buzzg
          .append("path")
          .classed("buzzpath", true)
          .attr("d", (data) => chartLine(data));
      });
  }, [data, resize]);

  return (
    <BuzzWrapper ref={buzzChartRef}>
      <svg ref={svgRef}>
        <defs>
          <linearGradient id="buzzGradient" x1="0" x2="0" y1="0" y2="100%">
            <stop id="stop1" offset="0%" stopColor="#F5746B" stopOpacity="1" />
            <stop
              id="stop2"
              offset="100%"
              stopColor="#F5746B"
              stopOpacity="0.2"
            />
          </linearGradient>
        </defs>
        <text className="title">버즈량 분석</text>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </BuzzWrapper>
  );
};

export default BuzzChart;
