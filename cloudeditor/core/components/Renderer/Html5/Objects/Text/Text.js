const React = require("react");

const DummyText = require("./DummyText");
const EditableText = require("./EditableText");

require("./Text.css");

const vAlign = {
  top: "flex-start",
  middle: "center",
  bottom: "flex-end"
};

const Text = props => {
  const { zoomScale } = props;

  let contentEditable = false;
  if (props.contentEditable | 0) contentEditable = true;

  let lineHeight = 1.2;
  const lineHeightP = parseFloat(props.lineheightp);
  const lineHeightN = parseFloat(props.lineheightn);
  if (!isNaN(lineHeightP)) {
    lineHeight = lineHeightP / 100;
  } else if (!isNaN(lineHeightN)) {
    lineHeight = lineHeightN + "px";
  }

  const style = {
    fontFamily: props.fontFamily,
    color: "rgb(" + props.fillColor + ")",
    fontSize: props.fontSize + "px",
    textAlign: props.textAlign,
    fontWeight: props.bold ? "bold" : "normal",
    fontStyle: props.italic ? "italic" : "normal",
    textDecoration: props.underline ? "underline" : "none",
    justifyContent: vAlign[props.vAlign],
    lineHeight: lineHeight
  };

  const content = contentEditable ? (
    <EditableText value={props.value} />
  ) : (
    <DummyText value={props.value} />
  );

  return (
    <div style={style} className="blockData">
      {content}
    </div>
  );
};

module.exports = Text;
