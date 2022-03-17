import { getPreviousDate } from "@utils/getPreviousDate";
import { getDateDiff } from "@utils/getDateDiff";
import calculateMovingAverageLine from "@utils/calculateMovingAverageLine";

const getInitialPeriodDate = (publicDate) => {
  const endDate = new Date();
  const yearDate = getPreviousDate(endDate, 365);
  const prevDate = new Date(yearDate);
  const startDate = prevDate > publicDate ? prevDate : publicDate;
  const diff = getDateDiff(startDate, endDate);
  return { startDate, endDate, diff };
};

function emotionDatasGenerator() {
  let data = [];
  let date = new Date("2021-08-01");
  function dataGenerator() {
    let emotion = Math.floor(Math.random() * 6);
    return Math.random() < 0.5 ? { value: emotion * -1 } : { value: emotion };
  }

  for (let i = 0; i < 360; i++) {
    data[i] = dataGenerator();
    data[i].date = date;
    date = new Date(date.setDate(date.getDate() + 1));
  }
  return data;
}

function buzzDatasGenerator() {
  let data = [];
  let date = new Date("2021-08-01");
  function dataGenerator() {
    let buzz = Math.floor(Math.random() * 6);

    return { value: buzz };
  }
  for (let i = 0; i < 360; i++) {
    data[i] = dataGenerator();
    data[i].date = date;
    date = new Date(date.setDate(date.getDate() + 1));
  }
  return data;
}

function stockDatasGenerator() {
  let data = [];
  let date = new Date("2021-08-01");
  let movingAverageLines = [5, 20, 60, 120];

  function dataGenerator() {
    let start = Math.floor(Math.random() * 500 + 9000);
    let end = Math.floor(Math.random() > 0.5 ? start - 200 : start + 200);
    let volume = Math.floor(Math.random() * 50000);

    return {
      start,
      end,
      volume,
      high:
        start > end
          ? Math.floor(start + Math.random() * 200)
          : Math.floor(end + Math.random() * 200),
      low:
        start < end
          ? Math.floor(start - Math.random() * 200)
          : Math.floor(end - Math.random() * 200),
    };
  }
  for (let i = 0; i < 360; i++) {
    data[i] = dataGenerator();
    data[i].date = date;
    date = new Date(date.setDate(date.getDate() + 1));
  }

  movingAverageLines.forEach((ele) => {
    calculateMovingAverageLine(data, ele);
  });
  return data;
}

function newsDatasGenerator() {
  let data = [];
  let date = new Date("2021-08-01");
  function dataGenerator(i) {
    return {
      title: "삼성전자, 8일 '갤럭시 탭 S7·S7+' 미스틱 네이비 색상 출시",
      summarized:
        "가격은 LTE 모델이 114만9500원, Wi-Fi 모델이 104만9400원이다. 가격은 5G 모델이 149만9300원, LTE 모델이139만9200원, Wi-Fi 모델이 129만9100원이다. '갤럭시 탭 S7+' 미스틱 네이비 모델은 5G LTE Wi-Fi 모델로 출시된다.",
      title: "삼성전자, 8일 '갤럭시 탭 S7·S7+' 미스틱 네이비 색상 출시",
      img: "http://www.paxetv.com/news/thumbnail/202104/114203_86612_1148_v150.jpg",
      url: "http://www.paxetv.com/news/articleView.html?idxno=114203",
      id: 4296132659 + i,
    };
  }
  for (let i = 0; i < 360; i++) {
    data[i] = dataGenerator(i);
    data[i].date = date;
    date = new Date(date.setDate(date.getDate() + 1));
  }
  return data;
}

const financeDatas = [
  [
    {
      date: "2021-6",
      values: [
        { type: "take", value: -42500 },
        { type: "profit", value: 91200 },
        { type: "netprofit", value: 31200 },
      ],
    },
    {
      date: "2021-9",
      values: [
        { type: "take", value: -42500 },
        { type: "profit", value: 91200 },
        { type: "netprofit", value: 31200 },
      ],
    },
    {
      date: "2021-12",
      values: [
        { type: "take", value: -42500 },
        { type: "profit", value: 91200 },
        { type: "netprofit", value: 31200 },
      ],
    },
  ],
  [
    {
      date: "2021-6",
      values: [
        { type: "assets", value: -42500 },
        { type: "dept", value: 91200 },
        { type: "capital", value: 31200 },
      ],
    },
    {
      date: "2021-9",
      values: [
        { type: "assets", value: -42500 },
        { type: "dept", value: 91200 },
        { type: "capital", value: 31200 },
      ],
    },
    {
      date: "2021-12",
      values: [
        { type: "assets", value: -42500 },
        { type: "dept", value: 91200 },
        { type: "capital", value: 31200 },
      ],
    },
  ],
  [
    {
      date: "2021-6",
      values: [
        { type: "sales", value: -42500 },
        { type: "investment", value: 91200 },
        { type: "finance", value: 31200 },
      ],
    },
    {
      date: "2021-9",
      values: [
        { type: "sales", value: -42500 },
        { type: "investment", value: 91200 },
        { type: "finance", value: 31200 },
      ],
    },
    {
      date: "2021-12",
      values: [
        { type: "sales", value: -42500 },
        { type: "investment", value: 91200 },
        { type: "finance", value: 31200 },
      ],
    },
  ],
];

const keywordDatas = [
  { title: "제품", value: 500 },
  { title: "삼성", value: 700 },
  { title: "기업", value: 400 },
  { title: "lg", value: 300 },
  { title: "수수료", value: 340 },
  { title: "시장", value: 150 },
  { title: "가격", value: 130 },
  { title: "반도체", value: 360 },
  { title: "갤럭시", value: 800 },
  { title: "lg전자", value: 200 },
];

const categoryDatas = [
  { title: "경제", value: 519 },
  { title: "세계", value: 123 },
  { title: "IT/인터넷/통신", value: 101 },
  { title: "생활", value: 91 },
  { title: "금융", value: 86 },
];

const pressDatas = [
  {
    title: "팍스넷",
    value: 838,
  },
  {
    title: "아이뉴스24",
    value: 261,
  },
  {
    title: "이투데이",
    value: 256,
  },
  {
    title: "파이낸셜뉴스",
    value: 225,
  },
  {
    title: "매일경제",
    value: 170,
  },
];

export const initialState = (publicDate) => ({
  period: getInitialPeriodDate(publicDate),
  publicDate: publicDate,
  today: new Date(),
  curDate: null,
  title: "삼성전자",
  periodError: false,
  stockData: stockDatasGenerator(),
  financialDatas: financeDatas,
  buzzDatas: buzzDatasGenerator(),
  emotionDatas: emotionDatasGenerator(),
  pressDatas: pressDatas,
  categoryDatas: categoryDatas,
  keywordDatas: keywordDatas,
  newsDatas: newsDatasGenerator(),
});

const SET_PERIOD_ACTION = "SET_PERIOD_ACTION";
export const setPeriod = (start, end, error) => ({
  actionType: SET_PERIOD_ACTION,
  startDate: start,
  endDate: end,
  periodError: error,
  diff: getDateDiff(end, start),
});

export const reducer = (state, action) => {
  const { actionType } = action;
  switch (actionType) {
    case SET_PERIOD_ACTION:
      return {
        ...state,
        period: {
          startDate: action.startDate,
          endDate: action.endDate,
          diff: action.diff,
        },
        periodError: action.periodError,
      };
    default:
      return state;
  }
};
