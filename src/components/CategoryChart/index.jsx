import React, { useRef, useEffect } from "react";
import { select, sum, treemap, hierarchy, pointer } from "d3";
import randomColor from "randomcolor";
import isBright from "@utils/isBright";
import { ChartWrapper } from "./style";
import getTextWidth from "@utils/getTextWidth";
import useResizeObserver from "@utils/useResizeObserver";
import useDebounce from "@utils/useDebounce";

const CategoryChart = ({
  data,
  width = 500,
  height = 300,
  toolTipHeight = 100,
  toolTipWidth = 100,
  focusTooltipColor = "#eee",
  marginTop = 40,
  marginBottom = 40,
  marginLeft = 40,
  marginRight = 40,
  padding = 0,
  darkTextColor = "black",

  brightTextColor = "white",
}) => {
  const svgRef = useRef(null);
  const categoryChartRef = useRef();
  const dimensions = useResizeObserver(categoryChartRef);
  const resize = useDebounce(dimensions, 200);
  useEffect(() => {
    const svg = select(svgRef.current);

    if (!resize) return;
    svg.selectAll(".block").remove();
    svg.selectAll("#categoryclip").remove();

    const { width, height } = resize;

    svg
      .append("clipPath")
      .attr("id", "categoryclip")
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("rx", 15)
      .attr("ry", 15);

    svg.attr("width", width).attr("height", height);

    const entireValue = sum(data, (data) => data.value);
    if (!data[0].color) {
      const colorArray = randomColor({
        hue: "green",
        luminosity: "light",
        alpha: 0.1,
        count: data.length,
      });

      data.map((ele, idx) => {
        ele.percentage = ((ele.value * 100) / entireValue).toFixed(2);
        ele.color = colorArray[idx];
      });
    }

    const createTree = treemap().size([width, height]);

    const mapData = hierarchy(data, (node) => node).sum((node) => node.value);

    const tree = createTree(mapData);

    const focus = svg.selectAll(".focus");

    const focusTooltip = focus.select(".focus-tooltip");

    svg
      .select(".blockarea")
      .attr("clip-path", "url(#categoryclip)")
      .selectAll(".block")
      .data(tree.leaves())
      .join((enter) => {
        const block = enter
          .append("g")
          .classed("block", true)
          .attr("transform", (node) => `translate(${node["x0"]},${node["y0"]})`)
          .on("mouseover", () => focusTooltip.style("display", null))
          .on("mouseout", () => focusTooltip.style("display", "none"))
          .on("mousemove", function (e) {
            focusTooltip
              .attr("x", e.offsetX)
              .attr("y", e.offsetY)
              .attr("width", toolTipWidth)
              .attr("height", toolTipHeight)
              .attr("opacity", 1)
              .attr("fill", focusTooltipColor)
              .attr(
                "transform",
                `translate(-${toolTipWidth / 2}, -${toolTipHeight / 2})`,
              );
          });

        block
          .append("rect")
          .classed("blockrect", true)
          .attr("width", (node) => {
            return node["x1"] - node["x0"];
          })
          .attr("height", (node) => {
            return node["y1"] - node["y0"];
          })
          .attr("fill", (node) => node["data"]["color"]);

        const blockTextG = block.append("g").classed("blocktextg", true);

        blockTextG
          .append("text")
          .attr("fill", (node) => {
            return isBright(node["data"]["color"]) ? "black" : "white";
          })
          .text((node) => node["data"]["percentage"] + "%")
          .attr("x", function () {
            const parentData = select(this.parentNode).datum();
            return (parentData.x1 - parentData.x0) / 2;
          })
          .attr("y", function () {
            const parentData = select(this.parentNode).datum();
            return (parentData.y1 - parentData.y0) / 2 + 7;
          });

        blockTextG
          .append("text")
          .attr("fill", (node) => {
            return isBright(node["data"]["color"])
              ? darkTextColor
              : brightTextColor;
          })
          .text(function (node) {
            const textWidth = getTextWidth(node["data"]["title"]);
            const textLength = node["data"]["title"].length;
            const rectWidth = node["x1"] - node["x0"] - 40;

            if (rectWidth < textWidth) {
              for (let i = textLength - 1; i > 0; i--) {
                const target = node["data"]["title"].substring(0, i) + "...";
                if (getTextWidth(target) < rectWidth) {
                  return target;
                }
              }
            }
            return node["data"]["title"];
          })
          .attr("x", function () {
            const parentData = select(this.parentNode).datum();
            return (parentData.x1 - parentData.x0) / 2;
          })
          .attr("y", function () {
            const parentData = select(this.parentNode).datum();
            return (parentData.y1 - parentData.y0) / 2 - 7;
          });
      });
  }, [data, resize]);
  return (
    <ChartWrapper ref={categoryChartRef}>
      <svg ref={svgRef}>
        <g className="blockarea" />
        <g className="focus">
          <rect className="focus-tooltip"></rect>
        </g>
      </svg>
    </ChartWrapper>
  );
};

export default CategoryChart;
