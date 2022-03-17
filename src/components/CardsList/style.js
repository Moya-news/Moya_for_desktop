import styled from "@emotion/styled";

export const CardsWrapper = styled.div`
  display: flex;
  width: 100%;
  margin: 50px 0;
  justify-content: space-between;

  & .card {
    box-shadow: 4px 0px 16px rgba(0, 14, 72, 0.04);
    background: #ffffff;
    flex: 1 1 0;
    border-radius: 8px;
  }

  & .card:not(:last-child) {
    margin-right: 20px;
  }

  & .card-info {
    margin: 32px 16px 10px 32px;
    display: flex;
  }

  & .card-info .emoji {
    margin-right: 16px;
  }

  & .card-info .title {
    font-size: 12px;
    color: #767676;
    margin-bottom: 2px;
  }

  & .card-info .number {
    font-size: 22px;
    font-weight: bold;
    color: #286f6c;
    margin-right: 4px;
  }

  & .number-des {
    font_size: 18px;
    color: #286f6c;
    margin-right: 4px;
  }

  & .unit {
    font_size: 12px;
    color: #767676;
  }

  & .period-date {
    font-size: 11px;
    color: #bebebe;
    text-align: right;
    margin: 6px 16px 10px 32px;
  }

  & .extreme_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 32px 32px 10px 32px;
    border-radius: 8px;
  }
  & .extreme_info .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  & .extreme_info .title {
    font-size: 12;
    color: #767676;
    margin-bottom: 2px;
  }

  & .extreme_info .date {
    color: #286f6c;
    font-weight: bold;
    font-size: 22px;
  }
`;
