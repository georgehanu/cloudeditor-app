const React = require("react");

const blockOrientation = props => {
  const { width, height, subType, zoomScale } = props;

  const mustBeTransformed =
    ["textflow", "text", "textline"].indexOf(subType) >= 0 ? true : false;

  const tinyMceTransform =
    ["tinymceTable"].indexOf(subType) >= 0 ? true : false;

  let style = {};
  if (mustBeTransformed) {
    style = {
      width: width / zoomScale + "px",
      height: height / zoomScale + "px",
      transform: `scale(${zoomScale})`,
      transformOrigin: "top left"
    };
  } else if (tinyMceTransform) {
    style = {
      width,
      height
    };
  }

  return (
    <div style={style} className={"blockOrientation north "}>
      {props.children}
    </div>
  );
};

module.exports = blockOrientation;
