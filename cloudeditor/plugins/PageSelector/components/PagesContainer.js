const React = require("react");
const { SinglePage } = require("./SinglePage");

const PagesContainer = props => {
  let items = [];
  items.push(<SinglePage key={-1} pageType="Center" text="Front" />);
  items.push(<SinglePage key={0} pageType="Left" text="&nbsp;" />);
  items.push(<SinglePage key={1} pageType="Right" text="1" />);

  let counter = 2;
  for (; counter < 30; counter += 2) {
    items.push(<SinglePage key={counter} pageType="Left" text={counter} />);
    items.push(
      <SinglePage key={counter + 1} pageType="Right" text={counter + 1} />
    );
  }

  return <div className="PageSelectorContainer">{items}</div>;
};

module.exports = { PagesContainer };
