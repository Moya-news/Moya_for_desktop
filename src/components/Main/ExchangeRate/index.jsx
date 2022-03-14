import React, { useState } from "react";
import { ExchangeRateWrapper } from "./style";
import ExchangeRateChart from "./ExchangeRateChart";
import stock_up from "@images/stock_up.svg";
import stock_down from "@images/stock_down.svg";
import stock_none from "@images/stock_none.svg";
import exch_rate_arrow_icon from "@images/exch_rate_arrow_icon.svg";
import { FromList } from "@components/ContentLoader";

export const ExchangeRateLoader = () => {
  return (
    <ExchangeRateWrapper>
      <FromList />
    </ExchangeRateWrapper>
  );
};

const ExchangeRate = ({ data }) => {
  const [isActive, setIsActive] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(data.items);

  const isActiveHandler = (country) => {
    setIsActive(country);
  };

  return (
    <ExchangeRateWrapper>
      <div className="top">
        <h2>환율</h2>
      </div>

      {exchangeRate.map((item, index) => (
        <div className="itemWrapper" key={item.id}>
          <div className="item">
            <div className="title" onClick={() => isActiveHandler(index)}>
              <h3>
                {item.id === "usd"
                  ? "미국(USD)"
                  : item.id === "eur"
                  ? "유럽연합(EUR)"
                  : item.id === "jpy"
                  ? "일본 JPY(100엔)"
                  : item.id === "cny"
                  ? "중국(CNY)"
                  : item.id === "gbp" && "영국(GBP)"}
              </h3>
              <div className="info">
                <div className="index" style={{ marginLeft: "auto" }}>
                  {item.stockIndex}
                </div>
                <div className="vs">
                  <img src={stock_none} alt="stock none" /> {item.vs}
                </div>
                <div className="rate">{item.rate}</div>
              </div>
              <div className={`arrow ${isActive === index && "active"}`}>
                <img src={exch_rate_arrow_icon} alt="arrow" />
              </div>
            </div>
            {isActive === index && <ExchangeRateChart data={item.chartData} />}
          </div>
        </div>
      ))}

      {/* <div className="itemWrapper">
        <div className="item">
          <div className="title" onClick={() => isActiveHandler("USD")}>
            <h3>미국(USD)</h3>
            <div className="info">
              <div className="index" style={{ marginLeft: "auto" }}>
                1,340.28
              </div>
              <div className="vs">
                <img src={stock_none} alt="stock none" /> 8.76
              </div>
              <div className="rate">-0.65%</div>
            </div>
            <div className={`arrow ${isActive === "USD" && "active"}`}>
              <img src={exch_rate_arrow_icon} alt="arrow" />
            </div>
          </div>
          {isActive === "USD" && <ExchangeRateChart />}
        </div>
      </div> */}

      {/* <div className="item">
        <div
          className="title"
          style={{ display: "flex" }}
          onClick={() => isActiveHandler("EUR")}>
          <h3>유럽(EUR)</h3>
          <div className="info blue">
            <div className="index" style={{ marginLeft: "auto" }}>
              1,340.28
            </div>
            <div className="vs">
              <img src={stock_down} alt="stock down" /> 8.76
            </div>
            <div className="rate">-0.65%</div>
          </div>
          <div className={`arrow ${isActive === "EUR" && "active"}`}>
            <img src={exch_rate_arrow_icon} alt="arrow" />
          </div>
        </div>
        {isActive === "EUR" && <ExchangeRateChart />}
      </div>

      <div className="item">
        <div
          className="title"
          style={{ display: "flex" }}
          onClick={() => isActiveHandler("JPY")}>
          <h3>일본 JPY(100엔)</h3>
          <div className="info red">
            <div className="index" style={{ marginLeft: "auto" }}>
              1,046.72
            </div>
            <div className="vs">
              <img src={stock_up} alt="stock up" /> 8.76
            </div>
            <div className="rate">+0.42%</div>
          </div>
          <div className={`arrow ${isActive === "JPY" && "active"}`}>
            <img src={exch_rate_arrow_icon} alt="arrow" />
          </div>
        </div>
        {isActive === "JPY" && <ExchangeRateChart />}
      </div>

      <div className="item">
        <div
          className="title"
          style={{ display: "flex" }}
          onClick={() => isActiveHandler("CNY")}>
          <h3>중국(CNY)</h3>
          <div className="info blue">
            <div className="index" style={{ marginLeft: "auto" }}>
              1,340.28
            </div>
            <div className="vs">
              <img src={stock_down} alt="stock down" /> 8.76
            </div>
            <div className="rate">-0.65%</div>
          </div>
          <div className={`arrow ${isActive === "CNY" && "active"}`}>
            <img src={exch_rate_arrow_icon} alt="arrow" />
          </div>
        </div>
        {isActive === "CNY" && <ExchangeRateChart />}
      </div>

      <div className="item">
        <div
          className="title"
          style={{ display: "flex" }}
          onClick={() => isActiveHandler("GBP")}>
          <h3>영국(GBP)</h3>
          <div className="info red">
            <div className="index" style={{ marginLeft: "auto" }}>
              1,340.28
            </div>
            <div className="vs">
              <img src={stock_up} alt="stock up" /> 4.36
            </div>
            <div className="rate">+0.42%</div>
          </div>
          <div className={`arrow ${isActive === "GBP" && "active"}`}>
            <img src={exch_rate_arrow_icon} alt="arrow" />
          </div>
        </div>
        {isActive === "GBP" && <ExchangeRateChart />}
      </div> */}
    </ExchangeRateWrapper>
  );
};

export default ExchangeRate;
