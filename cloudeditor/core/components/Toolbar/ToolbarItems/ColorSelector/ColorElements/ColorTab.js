const React = require("react");
const { connect } = require("react-redux");
const {
  colorTabSelector,
  getActiveBlockColors
} = require("./../../../../../stores/selectors/ui");

const ColorTab = props => {
  let colors = props.colors.map((color, index) => {
    return (
      <li
        key={color.id}
        style={{ backgroundColor: "rgb(" + color.htmlRGB + ")" }}
        className="ColorSquare"
        onClick={() => {
          const {
            htmlRGB,
            RGB,
            CMYK,
            separation,
            separationColorSpace,
            separationColor
          } = color;
          props.selectColor({
            mainHandler: true,
            payloadMainHandler: {
              type: props.type,
              value: {
                htmlRGB,
                RGB,
                CMYK,
                separation,
                separationColorSpace,
                separationColor
              }
            }
          });
        }}
      >
        {props.activeColors[props.activeTab] === color.htmlRGB && (
          <b className="icon printqicon-ok SelectedColor" />
        )}
      </li>
    );
  });
  return (
    <div className="ColorTabColorContainer">
      <ul className="">{colors}</ul>
    </div>
  );
};

const mapStateToProps = (state, props) => {
  return {
    colors: colorTabSelector(state, props),
    activeColors: getActiveBlockColors(state, props)
  };
};
module.exports = connect(
  mapStateToProps,
  null
)(ColorTab);
