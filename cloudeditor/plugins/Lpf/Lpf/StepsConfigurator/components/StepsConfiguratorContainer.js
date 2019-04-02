const React = require("react");
const PropTypes = require("prop-types");
const isEqual = require("react-fast-compare");
const { withNamespaces } = require("react-i18next");
const { connect } = require("react-redux");
const { geActiveStepOptionsSelector } = require("../../store/selectors/lpf");

class StepsContainerConfiguratorContainer extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    if (isEqual(nextState, this.state) && isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  };

  getTool = tool => {
    return tool.plugin;
  };
  renderTools = () => {
    return this.props.tools.map((tool, i) => {
      const Tool = this.getTool(tool);
      if (tool.type === this.props.activeStep.type)
        return (
          <Tool
            cfg={tool.cfg || {}}
            items={tool.items || []}
            key={i}
            addContainerClasses={this.props.addContainerClasses}
          />
        );
      return null;
    });
  };

  render() {
    return (
      <div className="stepsConfiguratorContainer">{this.renderTools()}</div>
    );
  }
}
const mapStateToProps = state => {
  return {
    activeStep: geActiveStepOptionsSelector(state)
  };
};

module.exports = connect(
  mapStateToProps,
  null
)(
  withNamespaces("stepsconfiguratorcontainer.js")(
    StepsContainerConfiguratorContainer
  )
);
