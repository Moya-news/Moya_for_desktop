import styled from "@emotion/styled";

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  & > .header-left {
    display: flex;
    justify-content: space-between;
  }

  & > .header-right {
    display: flex;
    justify-content: flex-end;
  }

  & > .header-right > button {
    all: unset;
    cursor: pointer;
    border-radius: 30px;
    background: #5fb6ad;
    color: white;
    padding: 10px 30px;
  }
`;

export const PeriodButtonsWrapper = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-wrap: no-wrap;
  & > button {
    all: unset;
    cursor: pointer;
    padding: 5px;
    font-size: 14;
    border-radius: 10px;
    margin: 3px;
  }
  & button img {
    margin-right: 6px;
  }
  .active {
    font-weight: bold;
  }
`;

export const DatePickerWrapper = styled.div`
  flex: 1 1 0;
  display: flex;
  justify-content: space-between;
  & > .react-datepicker-wrapper {
    width: auto;
    border-bottom: 1px solid #767676;
  }

  & > .react-datepicker-wrapper > .react-datepicker__input-container > input {
    border: none;
    padding: 5px;
    background: none;
    border-radius: 30px;
  }
`;

export const ErrorMessageWrapper = styled.div`
  position: absolute;
  color: red;
  margin-top: 10px;
  font-size: 12px;
`;
export const ContentsWrapper = styled.div`
  & .level1-wrapper {
    display: flex;
    justify-content: space-between;
  }

  & .chart-wrapper {
    flex: 1 1 0;
    min-height: 380px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 4px 0px 16px rgba(0, 14, 72, 0.04);
  }

  & .main-title {
    display: flex;
    align-items: center;
    padding: 28px 72px 0px 72px;
    font-size: 18px;
    font-weight: bold;
  }

  & .news-title {
    display: flex;
    align-items: center;
    padding: 20px 72px;
    font-size: 18px;
    font-weight: bold;
  }

  & .category-title {
    display: flex;
    align-items: center;
    padding: 0px calc(10% + 20px);
    font-size: 18px;
    font-weight: bold;
  }

  & .press-title {
    display: flex;
    align-items: center;
    padding: 0px calc(5% + 40px);
    font-size: 18px;
    font-weight: bold;
  }

  & .keyword-title {
    display: flex;
    align-items: center;
    padding: 0px 20%;
    font-size: 18px;
    font-weight: bold;
  }

  & .level1-chart-wrapper {
    flex: 1 1 0;
    margin-right: 10px;
    box-sizing: boder-box;
    display: flex;
    flex-direction: column;
  }
  & .level1-main-chart-wrapper {
    box-shadow: 4px 0px 16px rgba(0, 14, 72, 0.04);
    box-sizing: border-box;
    min-height: 389px;
    position: relative;
    background: #ffffff;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  & .main-chart-modal {
    position: absolute;
    z-index: 1000;
    width: 288px;
    height: 500px;
    top: 63;
    left: 72;
    background: #ffffff;
    border-radius: 8px;
  }

  & .main-chart-modal .modal-content {
    padding: 38px 28px 28px 28px;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    line-height: 16px;
    color: #767676;
  }

  & .modal-content .content {
    font-weight: 400;
    margin-top: 2px;
  }

  & .modal-content .click-graph {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #286f6c;
    font-weight: 400;
    font-size: 11px;
  }

  & .modal-content .click-graph img {
    margin: 8px 0;
  }

  & .modal-content .click-graph .click-desription {
    text-align: center;
    font-weight: 500;
    font-size: 12px;
    text-decoration-line: underline;
  }

  & .main-chart-title {
    font-weight: 500;
    font-size: 18px;
    margin-left: 40px;
    line-height: 26px;
  }

  & .level1-moya-chart-wrapper {
    box-shadow: 4px 0px 16px rgba(0, 14, 72, 0.04);
    flex: 1 1 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 12px;
  }

  & .buzz-chart-wrapper {
    box-shadow: 4px 0px 16px rgba(0, 14, 72, 0.04);
    box-sizing: border-box;
    max-height: 50%;
  }
  & .emotion-chart-wrapper {
    box-shadow: 4px 0px 16px rgba(0, 14, 72, 0.04);
    box-sizing: border-box;
    max-height: 50%;
  }

  & .level1-news-list-wrapper {
    flex: 1 1 0;
    box-shadow: 4px 0px 16px rgba(0, 14, 72, 0.04);
    max-height: 846px;
    margin-left: 10px;
    box-sizing: boder-box;
    background: #ffffff;
    border-radius: 12px;
  }

  & .level2-chart-wrapper {
    display: flex;
    margin: 20px 0;
    justify-content: space-between;
  }

  & .level2-chart-wrapper .chart-wrapper:nth-of-type(2) {
    margin: 0 20px;
  }
  & .finances-wrapper {
    box-shadow: 4px 0px 16px rgba(0, 14, 72, 0.04);
    width: 100%;
    background: #fff;
    box-sizing: border-box;
  }

  & .finances-title-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 28px 20px 20px 32px;
  }

  & .finances-title {
    display: flex;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }

  & .finances-buttons-wrapper {
    display: flex;
    justify-content: center;
  }

  & .finances-button {
    all: unset;
    cursor: pointer;
    font-size: 12px;
    color: #999999;
    border: 1px solid #e5e5ec;
    border-radius: 4px;
    cursor: pointer;
    padding: 4px 12px;
  }

  & .active {
    color: #ffffff;
    background: #286f6c;
  }

  & .finances-content {
    display: flex;
    justify-content: space-between;
  }

  & .finances-ele {
    display: flex;
    width: 100%;
    justify-content: center;
    flex-direction: column;
  }

  & .finances-ele.annual {
    flex-direction: row;
  }
  & .finances-ele .chart-wrapper {
    min-height: auto;
    border-radius: 0;
    background: none;
    border-bottom: 1px solid #e4e4e4;
    box-shadow: none;
  }
  & .title-emoji {
    margin-left: 12px;
  }

  & .info-emoji {
    cursor: pointer;
  }
`;

export const FooterWrapper = styled.div`
  display: flex;
  flex-direction: column;

  & .footer-comparison {
    box-shadow: 4px 0px 16px rgba(0, 14, 72, 0.04);
    width: 100%;
    background: #ffffff;
    min-height: 164px;
  }

  & .title-wrapper {
    display: flex;
    justify-content: space-between;
    padding: 28px 32px 20px 32px;
  }

  & .title {
    font-weight: bold;
    font-size: 18px;
    line-height: 26px;
    color: #111111;
  }

  & .title .title-button {
    all: unset;
    cursor: pointer;
    margin-left: 8px;
    font-size: 12px;
    border: 1px solid #e5e5ec;
    padding: 2px 12px 3px;
    color: #767676;
    border-radius: 31px;
  }

  & .footer-comparison-title {
    font-size: 34px;
    margin: 20px 0 0 32px;
  }

  & .card-wrapper {
    display: flex;
    justify-content: space-around;
    margin: 20px 32px 28px 32px;
  }

  & .period {
    font-size: 11px;
    line-height: 16px;
    text-align: right;
    padding: 2px 8px 3px;
    border: 1px solid #e8f1ee;
    color: #286f6c;
    box-sizing: border-box;
    border-radius: 26px;
  }

  & .footer-comparison:first-of-type {
    margin: 20px 0;
  }
`;
