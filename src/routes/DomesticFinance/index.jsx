import React, { useReducer, useMemo, useState } from "react";
import KeywordChart from "@components/KeywordChart";
import CategoryChart from "@components/CategoryChart";
import PressChart from "@components/pressChart";
import BuzzChart from "@components/BuzzChart";
import EmotionChart from "@components/EmotionChart";
import MainChart from "@components/MainChart";
import MainAreaChart from "@components/MainAreaChart";
import {
  reducer,
  initialState,
  setPeriod,
} from "@reducers/domesticfinance/domesticfinance";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  PeriodButtonsWrapper,
  ContentsWrapper,
  DatePickerWrapper,
  ErrorMessageWrapper,
  HeaderWrapper,
  FooterWrapper,
} from "./style";
import { getPreviousDate } from "@utils/getPreviousDate";
import FinanceChart from "@components/financeChart";
import CardsList from "@components/CardsList";
import useInput from "@utils/useInput";
import period_active from "@images/period_active.svg";
import period_unactive from "@images/period_unactive.svg";
import emotion_info from "@images/emotion_info.svg";
import mouse from "@images/mouse.svg";
import ComparisonCardsList from "@components/ComparisonCardsList";
import { timeFormat } from "d3";
import chart_description from "@images/chart_description.svg";
import Modal from "@components/Modal";
import NewsList from "@components/NewsList";

const DomesticStock = () => {
  const publicDate = useMemo(() => new Date("2021-08-01"), []);
  const [domesticState, dispatch] = useReducer(
    reducer,
    initialState(publicDate),
  );

  const {
    period,
    periodError,
    today,
    stockData,
    financialDatas,
    emotionDatas,
    buzzDatas,
    keywordDatas,
    categoryDatas,
    pressDatas,
    newsDatas,
    title,
  } = domesticState;

  const { startDate, endDate, diff } = period;

  const [curStartDate, onChangeCurStartDate, setCurStartDate] =
    useInput(startDate);
  const [curEndDate, onChangeCurEndDate, setCurEndDate] = useInput(endDate);
  const [quarterState, setQuarterState] = useState(true);
  const [openMainChartModal, setOpenMainChartModal] = useState(false);

  const onClickPeriodButton = (numOfDates) => {
    const newStartDate = getPreviousDate(endDate, numOfDates);
    const startError = newStartDate >= publicDate ? false : true;
    const targetStartDate =
      newStartDate >= publicDate ? newStartDate : publicDate;

    const curDate = new Date();
    const endError = curDate < endDate ? true : false;
    const targetEndDate = curDate < endDate ? curDate : endDate;

    setCurStartDate(targetStartDate);
    setCurEndDate(targetEndDate);

    dispatch(setPeriod(targetStartDate, targetEndDate, startError || endError));
  };

  const onClickPeriodApplyButton = () => {
    dispatch(setPeriod(curStartDate, curEndDate));
  };

  const onToggleQuarterButton = () => {
    setQuarterState((prev) => !prev);
  };

  const onOpenModal = (e) => {
    e.preventDefault();
    setOpenMainChartModal(true);
  };

  const onCloseModal = (e) => {
    e.stopPropagation();
    setOpenMainChartModal(false);
  };

  const filteredStockData = useMemo(
    () =>
      stockData.filter((ele) => ele.date <= endDate && ele.date >= startDate),
    [startDate, endDate, stockData],
  );

  const filteredBuzzData = useMemo(
    () =>
      buzzDatas.filter((ele) => ele.date <= endDate && ele.date >= startDate),
    [startDate, endDate, stockData],
  );

  const filteredNewsData = useMemo(
    () =>
      newsDatas.filter((ele) => ele.date <= endDate && ele.date >= startDate),
    [startDate, endDate, newsDatas],
  );

  const filteredEmotionData = useMemo(
    () =>
      emotionDatas.filter(
        (ele) => ele.date <= endDate && ele.date >= startDate,
      ),
    [startDate, endDate, emotionDatas],
  );

  const emotionGap = useMemo(() => {
    return {
      type:
        filteredEmotionData[0].value >
        filteredEmotionData[filteredEmotionData.length - 1].value
          ? "negative"
          : "positive",
      value: Math.abs(
        filteredEmotionData[0].value -
          filteredEmotionData[filteredEmotionData.length - 1].value,
      ),
    };
  }, [filteredEmotionData]);

  const emotionRate = useMemo(() => {
    let positive = 0;
    let negative = 0;
    filteredEmotionData.map((ele) => {
      ele.value >= 0 ? positive++ : negative++;
    });
    return positive >= negative
      ? {
          type: "positive",
          value: Math.floor((positive / (positive + negative)) * 100),
        }
      : {
          type: "negative",
          value: Math.floor((negative / (positive + negative)) * 100),
        };
  }, [filteredEmotionData]);

  const highestDate = useMemo(() => {
    let max = 0;
    filteredEmotionData.map((ele, index) => {
      if (ele.value > filteredEmotionData[max].value) {
        max = index;
      }
    });

    return timeFormat("%Y-%m-%d")(filteredEmotionData[max].date);
  }, [filteredEmotionData]);

  const lowestDate = useMemo(() => {
    let min = 0;
    filteredEmotionData.map((ele, index) => {
      if (ele.value < filteredEmotionData[min].value) {
        min = index;
      }
    });
    return timeFormat("%Y-%m-%d")(filteredEmotionData[min].date);
  }, [filteredEmotionData]);

  const mergedFinancialDatas = useMemo(() => {
    const copy = JSON.parse(JSON.stringify(financialDatas));
    return copy.map((datas) => {
      return datas.reduce((acc, data, idx) => {
        if (idx === 0) {
          return { ...data, date: `${new Date(data.date).getFullYear()}` };
        } else {
          acc.values.map((ele, index) => {
            ele.value = ele.value + data.values[index].value;
          });
          return acc;
        }
      }, {});
    });
  }, [financialDatas]);

  return (
    <main>
      <HeaderWrapper>
        <div className="header-left">
          <DatePickerWrapper>
            <ReactDatePicker
              dateFormat="yyyy.MM.dd"
              selected={curStartDate}
              onChange={onChangeCurStartDate}
              startDate={curStartDate}
              endDate={curEndDate}
              minDate={publicDate}
              selectsStart
            />
            <span>~</span>
            <ReactDatePicker
              dateFormat="yyyy.MM.dd"
              selected={curEndDate}
              selectsEnd
              onChange={onChangeCurEndDate}
              startDate={curStartDate}
              endDate={curEndDate}
              maxDate={today}
              minDate={curStartDate}
            />
          </DatePickerWrapper>
          <PeriodButtonsWrapper>
            <button
              onClick={() => onClickPeriodButton(30)}
              className={diff === 30 ? "active" : null}>
              <img src={diff === 30 ? period_active : period_unactive} />
              1개월
            </button>
            <button
              onClick={() => onClickPeriodButton(90)}
              className={diff === 90 ? "active" : null}>
              <img src={diff === 90 ? period_active : period_unactive} />
              3개월
            </button>
            <button
              onClick={() => onClickPeriodButton(180)}
              className={diff === 180 ? "active" : null}>
              <img src={diff === 180 ? period_active : period_unactive} />
              6개월
            </button>
            <button
              onClick={() => onClickPeriodButton(365)}
              className={diff === 365 ? "active" : null}>
              <img src={diff === 365 ? period_active : period_unactive} />
              1년
            </button>
            <button
              onClick={() => onClickPeriodButton(1095)}
              className={diff === 1095 ? "active" : null}>
              <img src={diff === 1095 ? period_active : period_unactive} />
              3년
            </button>
          </PeriodButtonsWrapper>
        </div>
        <div className="header-right">
          <button onClick={onClickPeriodApplyButton}>적용</button>
        </div>
      </HeaderWrapper>
      {periodError && (
        <ErrorMessageWrapper>
          {`상장일 이후부터 현재 날짜까지의 기간만 선택 가능합니다.`}
        </ErrorMessageWrapper>
      )}
      <ContentsWrapper>
        <CardsList
          title={title}
          numOfNews={filteredNewsData.length}
          startDate={curStartDate}
          endDate={curEndDate}
          highestDate={highestDate}
          emotionRate={emotionRate}
          lowestDate={lowestDate}
          emotionGap={emotionGap}
        />
        <div className="level1-wrapper">
          <div className="level1-chart-wrapper">
            <div className="level1-main-chart-wrapper">
              <div className="main-chart-wrapper">
                <div className="main-title">
                  주식차트
                  <div className="title-emoji">
                    <img
                      className="info-emoji"
                      src={chart_description}
                      onClick={onOpenModal}
                    />
                    <Modal
                      isOpen={openMainChartModal}
                      onCloseModal={onCloseModal}>
                      <div className="main-chart-modal">
                        <div className="modal-content">
                          <div>
                            <div className="modal-title">주식차트</div>
                            <div className="content">
                              검색한 종목/티커에 대한 기간내 주식차트를
                              보여줍니다.
                            </div>
                          </div>
                          <div>
                            <div className="title">버즈량</div>
                            <div className="content">
                              검색한 종목/티커에 대한 기간내 관련 뉴스 수집량에
                              대한 그래프입니다.
                            </div>
                          </div>
                          <div>
                            <div className="title">감성지수</div>
                            <img src={emotion_info} alt="emotion_info" />
                            <div className="content">
                              검색한 종목/티커에 대한 기간내 수집된 뉴스에서
                              단어를 분석하여 뉴스의 긍정과 부정을 판단하는
                              그래프입니다. 해당 날짜 값이 양수에 가까울 수록
                              긍정, 음수값에 가까울수록 부정적인 뉴스의 비율이
                              높다는 것을 확인할 수 있습니다.
                            </div>
                          </div>
                          <div className="click-graph">
                            <div>CLICK!</div>
                            <img src={mouse} alt="mouse" />
                            <div className="click-desription">
                              그래프를 눌러서
                              <br />
                              뉴스를 확인해 보세요
                            </div>
                          </div>
                        </div>
                      </div>
                    </Modal>
                  </div>
                </div>
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
              </div>
            </div>
            <div className="level1-moya-chart-wrapper">
              <div className="news-title">
                뉴스분석
                <img className="title-emoji" src={chart_description} />
              </div>
              <div className="buzz-chart-wrapper">
                <BuzzChart data={filteredBuzzData} />
              </div>
              <div className="emotion-chart-wrapper">
                <EmotionChart data={filteredEmotionData} />
              </div>
            </div>
          </div>
          <NewsList data={filteredNewsData} />
        </div>
        <div className="level2-chart-wrapper">
          <div className="chart-wrapper">
            <div className="keyword-title">
              키워드 분석
              <img className="title-emoji" src={chart_description} />
            </div>
            <KeywordChart data={keywordDatas} />
          </div>
          <div className="chart-wrapper">
            <div className="press-title">
              언론사 분석
              <img className="title-emoji" src={chart_description} />
            </div>
            <PressChart data={pressDatas} />
          </div>
          <div className="chart-wrapper">
            <div className="category-title">
              카테고리 분석
              <img className="title-emoji" src={chart_description} />
            </div>
            <CategoryChart data={categoryDatas} />
          </div>
        </div>
        <div className="finances-wrapper">
          <div className="finances-title-wrapper">
            <div className="finances-title">
              재무데이터 그래프
              <img className="title-emoji" src={chart_description} />
            </div>
            <div className="finances-buttons-wrapper">
              <button
                className={
                  quarterState ? "finances-button" : "finances-button active"
                }
                onClick={onToggleQuarterButton}>
                연간실적
              </button>
              <button
                className={
                  quarterState ? "finances-button active" : "finances-button"
                }
                onClick={onToggleQuarterButton}>
                분기실적
              </button>
            </div>
          </div>
          <div className="finances-content">
            {quarterState ? (
              financialDatas.map((quarter, idx) => (
                <div className="finances-ele" key={idx}>
                  {quarter.map((ele, index) => (
                    <div className="chart-wrapper" key={index * 10}>
                      <FinanceChart data={ele} tooltip={index === 0} />
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div className="finances-ele annual">
                {mergedFinancialDatas.map((ele, index) => (
                  <div className="chart-wrapper" key={index * 10}>
                    <FinanceChart data={ele} tooltip={true} dateFormat="%Y" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ContentsWrapper>
      <FooterWrapper>
        <div className="footer-comparison">
          <div className="title-wrapper">
            <div className="title">
              국내 종목비교
              <button className="title-button">반도체와반도체장비</button>
            </div>
            <div className="period">{timeFormat("%Y.%m.%d")(endDate)} 기준</div>
          </div>
          <ComparisonCardsList />
        </div>
        <div className="footer-comparison">
          <div className="title-wrapper">
            <div className="title">
              해외 종목비교
              <button className="title-button">반도체와반도체장비</button>
            </div>
            <div className="period">{timeFormat("%Y.%m.%d")(endDate)} 기준</div>
          </div>
          <ComparisonCardsList />
        </div>
      </FooterWrapper>
    </main>
  );
};

export default DomesticStock;
