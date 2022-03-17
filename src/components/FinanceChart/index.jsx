import {
  select,
  extent,
  axisBottom,
  scaleBand,
  scaleLinear,
  format,
  timeFormat,
} from "d3";
import React, { useEffect, useRef } from "react";
import useResizeObserver from "@utils/useResizeObserver";
import { FinanceChartWrapper } from "./style";
import { axisLeft } from "d3";
import getTextWidth from "@utils/getTextWidth";
import useDebounce from "@utils/useDebounce";

const FinanceChart = ({
  barWidth = 20,
  width = 500,
  height = 300,
  data,
  barSpace = 50,
  marginTop = 40,
  marginBottom = 40,
  marginLeft = 40,
  marginRight = 40,
  padding = 40,
  bandPadding = 0.3,
  dateFormat = "%Y. %m",
  tooltip = false,
}) => {
  const financeChartRef = useRef();
  const svgRef = useRef(null);
  const dimensions = useResizeObserver(financeChartRef);
  const resize = useDebounce(dimensions, 200);
  const financialType = useRef({
    take: "매출액",
    profit: "영업이익",
    netprofit: "순이익",
    assets: "자산총계",
    dept: "부채총계",
    capital: "자본총계",
    sales: "영업활동",
    investment: "투자활동",
    finance: "재무활동",
  });

  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll(".financeg").remove();
    svg.selectAll(".tooltipg").remove();

    if (!resize) return;

    const { width, height } = resize;
    svg.attr("width", width).attr("height", height);

    const [minX, maxX] = extent(data.values, (value) => value.value);
    const isBothSide = minX * maxX < 0 ? true : false;
    const isUnderZero = minX < 0;

    const xAbsMax =
      Math.abs(minX) > Math.abs(maxX) ? Math.abs(minX) : Math.abs(maxX);

    const xScale = scaleLinear()
      .domain([0, xAbsMax * 2])
      .range([marginLeft, width]);

    if (isUnderZero) {
      xScale.range([marginLeft, width / 2 - marginLeft]);
    }

    const yScale = scaleBand()
      .domain(data.values.map((value, idx) => idx))
      .range([height - marginBottom, marginTop])
      .padding(bandPadding);

    const xToolTipScale = scaleBand()
      .domain([0, data.length])
      .range([marginLeft, width / 2]);

    const xAxis = axisBottom(xScale).tickFormat(format("d"));
    const yAxis = axisLeft(yScale);

    svg
      .select(".y-axis")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call((g) => g.selectAll(".tick line").remove())
      .call((g) => g.selectAll(".domain").remove())
      .call((g) => {
        const nodes = g.selectAll(".tick").nodes();
        nodes.map((node, idx) => {
          idx === 1
            ? select(node)
                .select("text")
                .text(() => timeFormat(dateFormat)(new Date(data.date)))
                .attr("transform", `translate(${marginLeft},0)`)
                .classed("yAxisLabel", true)
            : select(node).select("text").remove();
        });
      });

    svg
      .selectAll(".financeg")
      .data(data.values)
      .join((enter) => {
        const financeg = enter.append("g").classed("financeg", true);

        financeg
          .append("rect")
          .attr("class", (value, index) => `financerect${index} ${value.type}`)
          .attr("x", (value) => {
            if (isUnderZero) {
              if (value.value < 0) {
                return width / 2 + xScale(value.value) - marginLeft * 2;
              }
              return width / 2;
            }
            return marginLeft;
          })
          .attr("y", (value, index, nodes) => {
            const length = nodes.length - 1;
            return yScale(length - index);
          })
          .attr("width", (value) => {
            return value.value < 0
              ? xScale(Math.abs(value.value))
              : xScale(value.value);
          })
          .attr("height", () => yScale.bandwidth())
          .attr("rx", 2)
          .attr("ry", 2);

        financeg
          .append("text")
          .attr(
            "class",
            (value) => `financetext ${value.value < 0 ? "minus" : "plus"}`,
          )
          .text((value) => value.value)
          .attr("x", (value) => {
            const textWidth = getTextWidth(value.value);
            if (isUnderZero) {
              if (value.value < 0) {
                return (
                  width / 2 + xScale(value.value) - marginLeft * 2 - textWidth
                );
              }
              return width / 2 + xScale(value.value) + textWidth;
            }
            return marginLeft;
          })
          .attr("y", (value, index, nodes) => {
            const length = nodes.length - 1;
            return yScale(length - index) + yScale.bandwidth() / 2;
          });
      });
    if (tooltip) {
      const toolTip = svg
        .select(".tooltip")
        .selectAll(".tooltipg")
        .data(data.values)
        .join((enter) => {
          const tooltipg = enter.append("g").classed("tooltipg", true);

          const tooltipgele = tooltipg
            .append("g")
            .attr("transform", (value, index) => {
              return `translate(${
                width / 2 + xToolTipScale.bandwidth() * index - marginLeft * 2
              },${marginBottom - 10})`;
            });

          tooltipgele
            .append("circle")
            .attr("class", (value, idx) => `${value.type} financerect${idx}`)
            .attr("r", 3)
            .attr("transform", `translate(${-marginLeft})`);

          tooltipgele
            .append("text")
            .text((value) => financialType.current[value.type]);
        });
    }
  }, [data, resize]);

  return (
    <FinanceChartWrapper ref={financeChartRef}>
      <svg ref={svgRef}>
        <g className="tooltip" />
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </FinanceChartWrapper>
  );
};

export default FinanceChart;
