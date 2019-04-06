const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");

require("./DecorationConfigurator.css");
const DecoratioConfiguratorContainer = require("./components/DecorationConfiguratorContainer");

class DecorationConfigurator extends React.Component {
  getTools = () => {
    return this.props.items.sort((a, b) => a.position - b.position);
  };
  render() {
    return (
      <DecoratioConfiguratorContainer
        tools={this.getTools()}
        addContainerClasses={this.props.addContainerClasses}
      />
    );
  }
}
const DecorationConfiguratorPlugin = connect()(
  withNamespaces("decorationConfigurator")(DecorationConfigurator)
);
module.exports = {
  DecorationConfigurator: assign(DecorationConfiguratorPlugin, {
    StepsConfigurator: {
      position: 2,
      priority: 1,
      type: "wall_decoration"
    }
  }),
  reducers: {}
};
