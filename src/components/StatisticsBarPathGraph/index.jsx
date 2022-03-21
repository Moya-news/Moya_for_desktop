import React, { useEffect, useRef } from "react";
import { GraphWrapper, Header } from "./style";
import {
  axisBottom,
  extent,
  max,
  scaleLinear,
  scaleBand,
  scaleTime,
  select,
  line,
  axisRight,
} from "d3";
import useResizeObserver from "@utils/useResizeObserver";

const StatisticsGraph = ({ data, unit, type }) => {
  const graphRef = useRef();
  const svgRef = useRef(null);
  const resizeWidth = useResizeObserver(graphRef);

  const barColor = ["#FECF5B", "#35A67D"];
  const pathColor = ["#065398", "#F5746B", "#35A67D"];

  const barKeys = {
    statistics: ["netInc", "opInc"],
    balance: ["marketCap", "liabilitiesCap"],
    income: ["salesNet", "investsNet"],
  };
  const pathKeys = {
    statistics: ["roe", "roa"],
    balance: [],
    income: [],
  };

  function topRounded(x, y, w, h, r, f) {
    if (f == undefined) f = 1;
    let x0 = x + r;
    let x1 = x + w - r;
    let y0 = y - h + r;
    let parts = [
      "M",
      x,
      y,
      "L",
      x,
      y0,
      "A",
      r,
      r,
      0,
      0,
      f,
      x0,
      y - h,
      "L",
      x1,
      y - h,
      "A",
      r,
      r,
      0,
      0,
      f,
      x + w,
      y0,
      "L",
      x + w,
      y,
      "Z",
    ];
    return parts.join(" ");
  }

  useEffect(() => {
    const graphWrapper = select(graphRef.current);
    const svg = select(svgRef.current);

    const yearly = data.yearly;

    const yLeftMax = Math.max(
      ...barKeys[type].map((key) => max(yearly, (year) => year[key])),
    );
    const yRightMax = Math.max(
      ...pathKeys[type].map((key) => max(yearly, (year) => year[key])),
    );

    svg.selectAll(".dots").remove();
    svg.selectAll(".lines").remove();
    svg.selectAll(".bars").remove();
    svg.selectAll(".tick line").remove();
    svg.selectAll(".y-left-axis").remove();

    if (!resizeWidth || !data) {
      return;
    }

    const width = resizeWidth.width;
    const height = 300;
    const margin = { top: 30, right: 30, bottom: 30, left: 30 };
    const innerPadding = 60;

    svg.attr("width", resizeWidth).attr("height", 300);

    const xBandScale = scaleBand()
      .domain(yearly.map((_, idx) => idx))
      .range([margin.left + innerPadding, width - margin.right - innerPadding])
      .paddingInner(0.5);

    const xScale = scaleTime()
      .domain(extent(yearly, (data) => new Date(data.basDt)))
      .range([
        margin.left + innerPadding + xBandScale.bandwidth() / 2,
        width - margin.right - innerPadding - xBandScale.bandwidth() / 2,
      ]);

    const xScaleDate = scaleTime()
      .domain([0, yearly.length - 1])
      .range([
        margin.left + innerPadding + xBandScale.bandwidth() / 2,
        width - margin.right - innerPadding - xBandScale.bandwidth() / 2,
      ]);
    const xAxisDate = axisBottom(xScaleDate).tickFormat(
      (_, index) => yearly[index].basDt,
    );

    const xBandAxis = axisBottom(xScale).tickFormat((node, i) => yearly[node]);

    svg
      .select(".x-axis")
      .call(xAxisDate)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .style("transform", `translate(0px, ${height - margin.bottom}px)`);
    svg
      .append("g")
      .call(xBandAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove())
      .style("transform", `translate(30px, ${height - margin.bottom}px)`);

    const yRightScale = scaleLinear()
      .domain([0, yRightMax])
      .range([height - margin.bottom, margin.top]);

    const yLeftScale = scaleLinear()
      .domain([0, yLeftMax])
      .range([height - margin.bottom, margin.top])
      .nice();

    svg
      .select(".y-axis")
      .call(
        axisRight(yRightScale)
          .ticks(6)
          .tickFormat((x) => parseInt(x)),
      )
      .style("transform", `translateX(${width - margin.right}px)`)
      .call((g) => g.selectAll(".domain").remove())
      .call((g) => g.selectAll(".tick line").remove());

    svg
      .append("g")
      .attr("class", "y-left-axis")
      .call(axisRight(yLeftScale).ticks(5))
      .call((g) => g.selectAll(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .attr("x1", 30)
          .attr("x2", width - 30)
          .style("stroke", "#f0f0f6")
          .style("transform", `translateX(-${margin.right}px)`),
      );

    svg
      .selectAll(".bar")
      .data(yearly)
      .join((enter) => {
        const bars = enter.append("g").classed("bars", true);

        Object.keys(yearly[0]).map((keys, idx) => {
          barKeys[type].includes(keys)
            ? bars
                .append("path")
                .attr("d", (node, index) =>
                  topRounded(
                    xBandScale(index),
                    yLeftScale(0),
                    xBandScale.bandwidth() / 2,
                    yLeftScale(0) - yLeftScale(node[keys]),
                    2,
                  ),
                )
                .attr("fill", barColor[idx % 2])
                .style(
                  "transform",
                  `translateX(${(xBandScale.bandwidth() / 2) * (idx % 2)}px)`,
                )
            : null;
        });
      });

    svg
      .selectAll(".line")
      .data([yearly])
      .join((enter) => {
        const lines = enter.append("g").classed("lines", true);

        Object.keys(yearly[0]).map((keys, idx) => {
          pathKeys[type].includes(keys)
            ? lines
                .append("path")
                .attr("fill", "none")
                .attr("stroke", pathColor[idx % 2])
                .attr("stroke-width", 2)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr(
                  "d",
                  line()
                    .x((d) => xScale(new Date(d["basDt"])))
                    .y((d) => yRightScale(d[keys])),
                )
            : null;
        });
      });

    svg
      .selectAll(".dots")
      .data(yearly)
      .join((enter) => {
        const dots = enter.append("g").classed("dots", true);

        Object.keys(yearly[0]).map((keys, idx) => {
          pathKeys[type].includes(keys)
            ? dots
                .append("circle")
                .attr("cx", (d) => xScale(new Date(d["basDt"])))
                .attr("cy", (d) => yRightScale(d[keys]))
                .attr("r", 3)
                .attr("fill", "#ffffff")
                .attr("stroke", pathColor[idx % 2])
                .attr("stroke-width", 2)
            : null;
        });
      });
  }, [data, type, resizeWidth]);

  return (
    <GraphWrapper ref={graphRef}>
      <Header>
        <div className="legend">
          {type === "statistics" ? (
            <>
              <div className="unit">[{unit}]</div>
              <div className="square yellow">
                <span className="icon"></span>
                영업이익
              </div>
              <div className="square green">
                <span className="icon"></span>
                순이익
              </div>
              <div className="circle blue">
                <span className="icon"></span>
                ROE
              </div>
              <div className="circle red">
                <span className="icon"></span>
                ROA
              </div>
            </>
          ) : type === "balance" ? (
            <>
              <div className="unit">[{unit}]</div>
              <div className="square yellow">
                <span className="icon"></span>
                부채총계
              </div>
              <div className="square green">
                <span className="icon"></span>
                자산총계
              </div>
            </>
          ) : (
            <>
              <div className="unit">[{unit}]</div>
              <div className="square yellow">
                <span className="icon"></span>
                영업손익
              </div>
              <div className="square green">
                <span className="icon"></span>
                투자손익
              </div>
            </>
          )}
        </div>
      </Header>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </GraphWrapper>
  );
};

export default StatisticsGraph;
