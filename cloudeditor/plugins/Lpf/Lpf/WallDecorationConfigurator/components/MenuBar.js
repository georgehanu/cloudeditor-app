const React = require("react");
require("./MenuBar.css");
const menuBar = props => {
  const items = props.items.map(item => {
    const classesStep = ["barStep", item.isActive ? "isActive" : ""].join(" ");
    return (
      <div
        className={classesStep}
        key={item.code}
        onClick={() => {
          props.changeCurrentStepHandler({ code: item.code });
        }}
      >
        <span>{item.label}</span>
      </div>
    );
  });
  return <div className="menuBarContainer">{items}</div>;
};
module.exports = menuBar;
