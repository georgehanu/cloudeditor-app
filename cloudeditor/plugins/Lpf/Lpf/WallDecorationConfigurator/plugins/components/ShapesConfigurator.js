const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
const Switch = require("react-switch");
const UncontrolledInput = require("../../.././components/UncontrolledInput/UncontrolledInput");
const {
  getShapesItemsSelector
} = require("../../../store/selectors/decorations");
const {
  enableDisableShape,
  selectShapeSubtype
} = require("../../../store/actions/decorations");

require("./ShapesConfigurator.css");
class ShapesConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };
  enableDisableShapeCornerHandler = (corner_code, value) => {
    this.props.enableDisableShapeHandler({
      code: corner_code,
      value
    });
  };
  selectShapeSubTypeHandler = (shape_subtype_code, shape_code) => {
    this.props.selectShapeSubTypeHandler({ shape_subtype_code, shape_code });
  };
  render() {
    const shapes = this.props.shapesItems.map((shape, index) => {
      let hasCircle = 0;
      const shapeImages = shape.subItems.map(subItem => {
        if (subItem.type === "circle" && subItem.selected) {
          hasCircle = 1;
        }
        const classes = [
          "shapeImageItem",
          subItem.selected ? "isActive" : ""
        ].join(" ");
        return (
          <div className={classes} key={subItem.code}>
            <img
              src={subItem.thumbnail_src}
              onClick={() => {
                return this.selectShapeSubTypeHandler(subItem.code, shape.code);
              }}
            />
          </div>
        );
      });
      let dimm = null;
      if (hasCircle) {
        dimm = (
          <React.Fragment>
            {"x "} <UncontrolledInput key={"x_" + shape.code} type="number" />
            {"y"}
            <UncontrolledInput key={"y_" + shape.code} type="number" />
          </React.Fragment>
        );
      } else {
        dimm = (
          <React.Fragment>
            {" R "}
            <UncontrolledInput key={shape.code} type="number" />
          </React.Fragment>
        );
      }
      return (
        <div className="shapeItem" key={index}>
          <div className="container">
            <Switch
              checked={shape.isActive}
              offColor="#E7E7E7"
              onColor="#E7E7E7"
              width={70}
              height={25}
              onChange={value => {
                this.enableDisableShapeCornerHandler(shape.code, value);
              }}
              key={shape.code}
              id={shape.code}
              uncheckedIcon={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    fontSize: 12,
                    color: "#000",
                    paddingRight: 2
                  }}
                >
                  {this.props.t("AUS")}
                </div>
              }
              checkedIcon={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    fontSize: 12,
                    color: "#000",
                    paddingRight: 2
                  }}
                >
                  {this.props.t("An")}
                </div>
              }
            />
          </div>
          <div className="container">{dimm}</div>
          <div className="shapesImages container">{shapeImages}</div>
        </div>
      );
    });
    return <div className="ShapesConfiguratorContainer">{shapes}</div>;
  }
}
const mapStateToProps = state => {
  return {
    shapesItems: getShapesItemsSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {
    enableDisableShapeHandler: payload => dispatch(enableDisableShape(payload)),
    selectShapeSubTypeHandler: payload => dispatch(selectShapeSubtype(payload))
  };
};

const ShapesConfiguratorPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("shapesConfigurator")(ShapesConfigurator));

module.exports = {
  ShapesConfigurator: assign(ShapesConfiguratorPlugin, {
    DecorationConfigurator: {
      position: 2,
      priority: 1,
      type: "shapes"
    }
  })
};
