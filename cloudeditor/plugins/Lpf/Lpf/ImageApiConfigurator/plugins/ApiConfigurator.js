const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");

require("./ApiConfigurator.css");
const ApiConfiguratorContainer = require("./components/ApiConfiguratorContainer");

class ApiConfigurator extends React.Component {
  getTools = () => {
    return this.props.items.sort((a, b) => a.position - b.position);
  };
  render() {
    return (
      <ApiConfiguratorContainer
        tools={this.getTools()}
        addContainerClasses={this.props.addContainerClasses}
      />
    );
  }
}
const ApiConfiguratorPlugin = connect()(
  withNamespaces("ApiConfigurator")(ApiConfigurator)
);
module.exports = {
  ApiConfigurator: assign(ApiConfiguratorPlugin, {
    StepsConfigurator: {
      position: 2,
      priority: 1,
      type: "image_api"
    }
  }),
  reducers: {}
};
