const React = require("react");
const SinglePage = require("./SinglePage");

const SinglePageContainer = props => {
  const className =
    "SinglePageContainer " +
    (props.pageType === undefined ? "" : "SinglePage" + props.pageType);

  return (
    <div className={className}>
      <SinglePage {...props} />
      <div className="SinglePageText">{props.text}</div>
    </div>
  );
};

module.exports = SinglePageContainer;
