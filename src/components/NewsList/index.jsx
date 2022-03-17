import React from "react";

const NewsList = ({ data }) => {
  console.log(data);
  return (
    <div className="level1-news-list-wrapper">
      <ul>
        {data.map((ele) => (
          <li key={ele.id}>{ele.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;

const News = () => {
  return <div>hi</div>;
};
