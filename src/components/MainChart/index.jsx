import {
  select,
  scaleTime,
  axisRight,
  pointer,
  scaleBand,
  line,
  bisector,
  scaleLinear,
  min,
  curveBasis,
  max,
  axisBottom,
  timeFormat,
  zoom,
} from "d3";
import React, { useEffect, useRef, useState } from "react";
import useResizeObserver from "@utils/useResizeObserver";
import { MainChartWrapper } from "./style";
import useDebounce from "@utils/useDebounce";
import numberWithCommas from "@utils/numberWithComma";
import { ticks } from "d3";

const MainChart = ({
  marginTop = 40,
  marginBottom = 40,
  marginLeft = 40,
  data,
  endDate,
  startDate,
  marginRight = 40,
  volumeChartHeight = 40,
  focusCircleColor = "#eee",
  focusLineColor = "#696969",
  focusLineWidth = 1.5,
  toolTipWidth = 142,
  toolTipHeight = 150,
  toolTipColor = "#ffffffcc",
  overlayColor = "#fff",
  bandPadding = 0.3,
  movingAverageLines = [5, 20, 60, 120],
}) => {
  const svgRef = useRef(null);
  const mainChartRef = useRef(null);
  const dimensions = useResizeObserver(mainChartRef);
  const [zoomState, setZoomState] = useState();
  const resize = useDebounce(dimensions, 200);
  useEffect(() => {
    const svg = select(svgRef.current);
    svg.selectAll(".candlestick").remove();
    svg.selectAll(".volume").remove();
    svg.selectAll("#clip").remove();

    // 이전 데이터와 비교하여 달라질 경우에만 계산하기
    // data를 어떻게 관리할지 고민이됨
    //const dataDiff= JSON.stringify(data)!==JSON.stringify(prevData)

    if (!resize) return;

    const { width, height } = resize;
    svg.attr("width", width).attr("height", height);

    movingAverageLines.forEach((ele) => {
      svg.selectAll(`.moving-average-${ele}`).remove();
    });

    const xMin = min(data, (data) => data.date);
    const xMax = max(data, (data) => data.date);
    const yPriceMin = min(data, (data) => data.low);
    const yPriceMax = max(data, (data) => data.high);
    const yVolumeMin = min(data, (data) => data.volume);
    const yVolumeMax = max(data, (data) => data.volume);

    const xScale = scaleTime()
      .domain([xMin, xMax])
      .range([marginRight, width - marginLeft]);

    const xBandScale = scaleBand()
      .domain(data.map((data, idx) => idx))
      .range([marginRight, width - marginLeft])
      .padding(bandPadding);

    const yPriceScale = scaleLinear()
      .domain([yPriceMin, yPriceMax])
      .range([height - volumeChartHeight - marginBottom, marginTop]);

    const yVolumeScale = scaleLinear()
      .domain([yVolumeMin, yVolumeMax])
      .range([height - marginBottom, height - volumeChartHeight - marginTop]);

    const xAxis = axisBottom(xScale)
      .tickFormat(timeFormat("%Y.%m.%d"))
      .tickValues(ticks(xMin, xMax, 7))
      .tickSize(-(height - marginBottom - marginTop));

    if (zoomState) {
      const newXScale = zoomState.rescaleX(xScale);
      let [newStart, newEnd] = newXScale.domain();
      newStart = newStart < xMin ? xMin : newStart;
      newEnd = newEnd > xMax ? xMax : newEnd;
      xScale.domain([newStart, newEnd]);
      xBandScale.range(
        [marginLeft, width - marginRight].map((data) => zoomState.applyX(data)),
      );

      xAxis.tickValues(ticks(newStart, newEnd, 7));
    }

    const movingAverageArea = svg.select(".movingaveragearea");

    movingAverageLines.forEach((ele) => {
      const movingAverageLineGenerator = line()
        .x((data) => xScale(data.date))
        .y((data) => yPriceScale(data[`average${ele}`]))
        .curve(curveBasis);

      const movingAverageLine = movingAverageArea
        .selectAll(`.moving-average-${ele}`)
        .data([data]);

      movingAverageLine.join((enter) =>
        enter
          .append("path")
          .attr("clip-path", "url(#clip)")
          .style("fill", "none")
          .classed(`moving-average-${ele}`, true)
          .attr("stroke-width", 1.5)
          .attr("d", movingAverageLineGenerator),
      );
    });

    svg.style("display", "block");

    const yPriceAxis = axisRight(yPriceScale).tickSize(
      -(width - marginLeft - marginRight),
    );
    const yVolumeAxis = axisRight(yVolumeScale)
      .tickSize(-(width - marginLeft - marginRight))
      .tickValues(ticks(yVolumeMin, yVolumeMax, 4));
    svg
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width - marginLeft - marginRight)
      .attr("height", height)
      .attr("x", marginLeft)
      .attr("y", marginBottom);

    svg
      .select(".x-axis")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis)
      .call((g) => g.select(".domain").remove());

    svg
      .select(".y-priceaxis")
      .attr("transform", `translate(${width - marginLeft},0)`)
      .call(yPriceAxis)
      .call((g) => g.select(".domain").remove());

    svg
      .select(".y-volumeaxis")
      .attr("transform", `translate(${width - marginLeft},0)`)
      .call(yVolumeAxis)
      .call((g) => g.select(".domain").remove());

    const overlay = svg
      .selectAll(".overlay")
      .attr("opacity", 0)
      .attr("width", width - marginLeft)
      .attr("height", height - marginBottom)
      .attr("fill", overlayColor)
      .style("pointer-events", "all");

    const focus = svg.selectAll(".focus");

    function generateCrosshair(e) {
      const focus = select(".focus");
      const bisectDate = bisector((data) => data.date).left;
      // 마우스 위치(width 기반)으로 날짜를 얻음
      const curPositionDate = xScale.invert(pointer(e, e.target)[0]);
      // 현재 마우스로 데이터를 나눔
      const i = bisectDate(data, curPositionDate, 1);
      const startDate = data[i - 1];
      const endDate = data[i];
      // 더 가까운 값을 기준으로 하게 함
      const currentPoint =
        curPositionDate - startDate.date > endDate.date - curPositionDate
          ? endDate
          : startDate;

      focus
        .selectAll("line")
        .style("fill", "none")
        .style("stroke", focusLineColor)
        .style("stroke-width", `${focusLineWidth}px`)
        .style("stroke-dasharray", "3 3");

      focus
        .select(".focus-tooltip")
        .attr("width", toolTipWidth)
        .attr("height", toolTipHeight)
        .attr("opacity", 1)
        .attr("fill", toolTipColor)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr(
          "transform",
          `translate(-${toolTipWidth / 2}, -${toolTipHeight / 2})`,
        );

      focus
        .select(".focus-textg")
        .attr(
          "transform",
          `translate(-${toolTipWidth / 2}, -${toolTipHeight / 2})`,
        );

      focus.attr(
        "transform",
        `translate(${
          xScale(currentPoint.date) - xBandScale.bandwidth() / 2
        }, ${yPriceScale(currentPoint.end)})`,
      );

      focus
        .select("line.x-line")
        .attr("x1", 0)
        .attr("x2", width - marginLeft - xScale(currentPoint.date))
        .attr("y1", 0)
        .attr("y2", 0);

      focus
        .select("line.y-line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", height - marginBottom - yPriceScale(currentPoint.end));

      focus.select(".startlabel").text("시가");
      focus.select(".endlabel").text("고가");

      focus
        .select(".starttext")
        .text(`${numberWithCommas(currentPoint.start)}`);
      focus.select(".endtext").text(`${numberWithCommas(currentPoint.end)}`);

      movingAverageLines.map((ele) => {
        focus
          .select(`.average${ele}text`)
          .text(`${numberWithCommas(currentPoint[`average${ele}`])}`);

        focus.select(`.average${ele}label`).text(`${ele}일선`);
      });

      focus
        .select(".focus-date")
        .text(`${timeFormat("%y.%m.%d")(currentPoint.date)}`);
    }

    const focusDate = focus.select(".focus-date").attr("x", 10).attr("y", 20);

    const focusText = focus.selectAll(".focus-text");

    focusText.attr("x", toolTipWidth / 2 + 10).attr("y", (value, index) => {
      return toolTipHeight / 4 + 20 * index;
    });

    const focusLabel = focus.selectAll(".focus-label");

    focusLabel.attr("x", 10).attr("y", (value, index) => {
      return toolTipHeight / 4 + 20 * index;
    });

    overlay
      .on("mouseover", () => focus.style("display", null))
      .on("mouseout", () => focus.style("display", "none"))
      .on("mousemove", function (e) {
        generateCrosshair(e);
      });

    //Zoom

    const zoomBehavior = zoom()
      .scaleExtent([1, 3])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", function (e) {
        const newZoomState = e.transform;
        setZoomState(newZoomState);
      });

    svg.call(zoomBehavior);

    const candleStickLineGenerator = line()
      .x((data) => data.x)
      .y((data) => data.y);

    const candleStick = svg
      .select(".candlesticks")
      .attr("clip-path", "url(#clip)")
      .selectAll(".candlestick")
      .data(data);

    candleStick.join((enter) => {
      const candleSticksEnter = enter
        .append("g")
        .classed("candlestick", true)
        .append("g")
        .classed("bars", true);

      candleSticksEnter
        .append("path")
        .attr("clip-path", "url(#clip)")
        .classed("high-row", true)
        .attr("d", (data) => {
          return candleStickLineGenerator([
            {
              x: xScale(data.date) - xBandScale.bandwidth() / 2,
              y: yPriceScale(data.high),
            },
            {
              x: xScale(data.date) - xBandScale.bandwidth() / 2,
              y: yPriceScale(data.low),
            },
          ]);
        })
        .attr("stroke", (d) => {
          if (d.end >= d.start) {
            return "#F5746B";
          } else {
            return "#065398";
          }
        });

      candleSticksEnter
        .append("rect")
        .attr("clip-path", "url(#clip)")
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("x", (data) => xScale(data.date) - xBandScale.bandwidth())
        .attr("y", (data) => {
          // 시가 위치에 오도록
          if (data.end > data.start) return yPriceScale(data.end);
          else if (data.end === data.start) return yPriceScale(data.end) - 1;
          else return yPriceScale(data.start);
        })
        .attr("width", (data) => xBandScale.bandwidth())
        .attr("height", (data) => {
          if (data.end > data.start)
            return yPriceScale(data.start) - yPriceScale(data.end);
          else if (data.end === data.start) return 3;
          else return yPriceScale(data.end) - yPriceScale(data.start);
        })
        .attr("fill", (d) => {
          if (d.end >= d.start) {
            return "#F5746B";
          } else {
            return "blue";
          }
        });
    });

    const volumes = svg
      .select(".volumes")
      .attr("clip-path", "url(#clip)")
      .selectAll(".volume")
      .data(data);

    volumes.join((enter) => {
      const volumesEnter = enter.append("g").classed("volume", true);

      volumesEnter
        .append("rect")
        .attr("clip-path", "url(#clip)")
        .attr("fill", " rgba(253, 192, 85, 0.2)")
        .attr("x", (data) => xScale(data.date) - xBandScale.bandwidth())
        .attr("y", (data) => yVolumeScale(yVolumeMax))
        .attr("width", () => xBandScale.bandwidth())
        .attr(
          "height",
          (data) => yVolumeScale(yVolumeMin) - yVolumeScale(yVolumeMax),
        );

      volumesEnter
        .append("rect")
        .attr("clip-path", "url(#clip)")
        .attr("fill", "#FDC055")
        .attr("rx", 4)
        .attr("ry", 4)
        .attr("x", (data) => xScale(data.date) - xBandScale.bandwidth())
        .attr("y", (data) => yVolumeScale(data.volume))
        .attr("width", () => xBandScale.bandwidth())
        .attr(
          "height",
          (data) => yVolumeScale(yVolumeMin) - yVolumeScale(data.volume),
        );
    });
  }, [data, zoomState, resize]);

  return (
    <MainChartWrapper ref={mainChartRef}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-priceaxis" />
        <g className="y-volumeaxis" />
        <g className="volumes" />
        <g className="movingaveragearea" />
        <g className="candlesticks" />
        <rect className="overlay" />
        <g className="focus">
          <line className="x-line" />
          <line className="y-line" />
          <rect className="focus-tooltip" />
          <g className="focus-textg">
            <text className="focus-date"></text>
            <text className="startlabel focus-label"></text>
            <text className="endlabel focus-label"></text>
            <text className="average5label focus-label"></text>
            <text className="average20label focus-label"></text>
            <text className="average60label focus-label"></text>
            <text className="average120label focus-label"></text>

            <text className="starttext focus-text" />
            <text className="endtext focus-text" />
            <text className="average5text focus-text" />
            <text className="average20text focus-text" />
            <text className="average60text focus-text" />
            <text className="average120text focus-text" />
          </g>
        </g>
      </svg>
    </MainChartWrapper>
  );
};

export default MainChart;
