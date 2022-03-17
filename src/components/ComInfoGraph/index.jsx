import React, { useReducer, useMemo } from "react";
import { GraphWrapper } from "./style";
import {
  reducer,
  initialState,
  setPeriod,
} from "@reducers/domesticfinance/domesticfinance";
import MainAreaChart from "@components/MainAreaChart";
import MainChart from "@components/MainChart";

const publicDate = new Date("2021-08-01");

const DoFinancialGraph = () => {
  const [domesticState, dispatch] = useReducer(
    reducer,
    initialState(publicDate),
  );

  const { period, stockData } = domesticState;
  const { startDate, endDate, diff } = period;

  const filteredStockData = useMemo(
    () =>
      stockData.filter((ele) => ele.date <= endDate && ele.date >= startDate),
    [stockData],
  );

  return (
    <GraphWrapper>
      {diff < 91 && startDate && endDate ? (
        <MainChart
          startDate={startDate}
          endDate={endDate}
          data={filteredStockData}
        />
      ) : (
        <MainAreaChart
          startDate={startDate}
          endDate={endDate}
          data={filteredStockData}
        />
      )}
    </GraphWrapper>
  );
};

export default DoFinancialGraph;
