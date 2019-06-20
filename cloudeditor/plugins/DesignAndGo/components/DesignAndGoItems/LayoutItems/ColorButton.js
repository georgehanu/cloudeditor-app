const React = require("react");

const ColorButton = props => {
  const className = "ColorButton" + (props.active ? " ColorButtonActive" : "");
  const containerBgColorStyle = props.color3
    ? { backgroundColor: "rgb(" + props.color3.htmlRGB + ")" }
    : {};
  const color1Style = props.color1
    ? { backgroundColor: "rgb(" + props.color1.htmlRGB + ")" }
    : {};
  const color2Style = props.color2
    ? { backgroundColor: "rgb(" + props.color2.htmlRGB + ")" }
    : {};

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
