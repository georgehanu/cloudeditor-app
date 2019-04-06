const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
const { getMenuBarStepsSelector } = require("../store/selectors/decorations");
const { changeDecorationsStep } = require("../store/actions/decorations");
const MenuBar = require("./components/MenuBar.js");

class WallDecorationConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };

  render() {
    return (
      <div className="wallDecorationConfiguratorContainer">
        <MenuBar
          items={this.props.menuBarSteps}
          changeCurrentStepHandler={this.props.changeDecorationsStepHandler}
        />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { menuBarSteps: getMenuBarStepsSelector(state) };
};
const mapDispatchToProps = dispatch => {
  return {
    changeDecorationsStepHandler: payload =>
      dispatch(changeDecorationsStep(payload))
  };
};

const WallDecorationConfiguratorPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("wall_decoration")(WallDecorationConfigurator));

module.exports = {
  WallDecorationConfigurator: assign(WallDecorationConfiguratorPlugin, {
    StepsConfigurator: {
      position: 2,
      priority: 1,
      type: "wall_decoration"
    }
  }),
  reducers: { decorations: require("../store/reducers/decorations") }
};
