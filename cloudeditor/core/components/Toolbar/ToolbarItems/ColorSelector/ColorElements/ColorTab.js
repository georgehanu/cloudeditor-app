const React = require("react");

const ColorTab = props => {
  let colors = props.data.map((el, index) => {
    return (
      <li
        key={index}
        style={{ backgroundColor: el }}
        className="ColorSquare"
        onClick={() =>
          props.selectColor({
            mainHandler: true,
            payloadMainHandler: { type: props.type, value: el }
          })
        }
      >
        {index === props.selectedIndex && (
          <b className="icon printqicon-ok SelectedColor" />
        )}
      </li>
    );
  });
  {
    /*colors.length > 0 && colors.push(<li key={colors.length} className="ColorSquare AddColor">+</li>)*/
  }

  return (
    <div className="ColorTabColorContainer">
      <ul className="">{colors}</ul>
    </div>
  );
};

module.exports = ColorTab;
