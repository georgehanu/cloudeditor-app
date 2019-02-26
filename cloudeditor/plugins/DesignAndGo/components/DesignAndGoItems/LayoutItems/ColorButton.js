const React = require("react");

const ColorButton = props => {
  const className = "ColorButton" + (props.active ? " ColorButtonActive" : "");
  const containerBgColorStyle = props.color3
    ? { backgroundColor: props.color3 }
    : {};
  const color1Style = props.color1 ? { backgroundColor: props.color1 } : {};
  const color2Style = props.color2 ? { backgroundColor: props.color2 } : {};

  return (
    <div className={className} onClick={props.clicked}>
      <div className="ColorButtonBg" style={{ ...containerBgColorStyle }}>
        <div className="ColorButton1" style={{ ...color1Style }} />
        <div className="ColorButton2" style={{ ...color2Style }} />
      </div>
    </div>
  );
};

module.exports = ColorButton;
