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
      .attr("width", width - marginLeft)
      .attr("height", height - marginBottom)
      .attr("rx", 4)
      .attr("ry", 4);

    svg
      .attr("width", width - marginLeft)
      .attr("height", height - marginBottom)
      .attr("transform", `translate(${marginLeft / 2},${marginBottom / 2})`);

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

    const createTree = treemap().size([
      width - marginLeft,
      height - marginBottom,
    ]);

    const mapData = hierarchy(data, (node) => node).sum((node) => node.value);

    const tree = createTree(mapData);

    svg
      .select(".blockarea")
      .attr("clip-path", "url(#categoryclip)")
      .selectAll(".block")
      .data(tree.leaves())
      .join((enter) => {
        const block = enter
          .append("g")
          .classed("block", true)
          .attr(
            "transform",
            (node) => `translate(${node["x0"]},${node["y0"]})`,
          );

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
          .classed(".blockcategory", true)
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
          .attr("width", "100")
          .classed(".blockpercent", true)
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
    <>
      <ChartWrapper ref={categoryChartRef}>
        <svg ref={svgRef}>
          <g className="blockarea" />
        </svg>
      </ChartWrapper>
    </>
  );
};

export default CategoryChart;
