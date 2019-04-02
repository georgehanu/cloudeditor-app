const React = require("react");
const { connect } = require("react-redux");
const { createSelector } = require("reselect");
const PropTypes = require("prop-types");
const { withNamespaces } = require("react-i18next");

require("./StepsConfigurator.css");
const StepsConfiguratorContainer = require("./components/StepsConfiguratorContainer");

class StepsConfigurator extends React.Component {
  getTools = () => {
    return this.props.items.sort((a, b) => a.position - b.position);
  };
  render() {
    return (
      <StepsConfiguratorContainer
        id={this.props.id}
        tools={this.getTools()}
        addContainerClasses={this.props.addContainerClasses}
      />
    );
  }
}
const StepsConfiguratorPlugin = connect()(
  withNamespaces("stepsConfigurator")(StepsConfigurator)
);
module.exports = {
  StepsConfigurator: StepsConfiguratorPlugin,
  reducers: {}
};
