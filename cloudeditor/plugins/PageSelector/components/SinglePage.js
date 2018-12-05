const React = require("react");

const SinglePage = props => {
  const className =
    "SinglePageContainer " +
    (props.pageType === undefined ? "" : "SinglePage" + props.pageType);

  //  class="SinglePageRight" pageType="center" />

  return (
    <div className={className}>
      <div className="SinglePage" />
      <div className="SinglePageText">{props.text}</div>
    </div>
  );
};

module.exports = { SinglePage };
