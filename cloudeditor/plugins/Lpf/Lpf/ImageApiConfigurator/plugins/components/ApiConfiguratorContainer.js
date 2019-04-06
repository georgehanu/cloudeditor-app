const React = require("react");
const PropTypes = require("prop-types");
const isEqual = require("react-fast-compare");
const { withNamespaces } = require("react-i18next");
const { connect } = require("react-redux");
const {
  getCurrentApiStepSelector
} = require("../../../store/selectors/imageApi");
class ApiConfiguratorContainer extends React.Component {
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
      if (tool.type === this.props.activeStep)
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
    return <div className="ApiConfiguratorContainer">{this.renderTools()}</div>;
  }
}
const mapStateToProps = state => {
  return { activeStep: getCurrentApiStepSelector(state) };
};

module.exports = connect(
  mapStateToProps,
  null
)(withNamespaces("api_configurator")(ApiConfiguratorContainer));
