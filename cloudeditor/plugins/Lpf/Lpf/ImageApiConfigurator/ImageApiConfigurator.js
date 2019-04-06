const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
const { getApiStepsBarSelector } = require("../store/selectors/imageApi");
const { changeApiStep } = require("../store/actions/imageApi");
const MenuBar = require("../WallDecorationConfigurator/components/MenuBar");

class ImageApiConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };

  render() {
    return (
      <div className="ImageApiConfiguratorContainer">
        <MenuBar
          items={this.props.menuBarSteps}
          changeCurrentStepHandler={this.props.changeApiStepHandler}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { menuBarSteps: getApiStepsBarSelector(state) };
};
const mapDispatchToProps = dispatch => {
  return {
    changeApiStepHandler: payload => dispatch(changeApiStep(payload))
  };
};

const ImageApiConfiguratorPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("apibar")(ImageApiConfigurator));

module.exports = {
  ImageApiConfigurator: assign(ImageApiConfiguratorPlugin, {
    StepsConfigurator: {
      position: 2,
      priority: 1,
      type: "image_api"
    }
  }),
  reducers: { imageApi: require("../store/reducers/imageApi") }
};
