const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
require("./MaterialConfigurator.css");

class MaterialConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };
  render() {
    return (
      <div className="materialConfiguratorContainer">MaterialConfigurator</div>
    );
  }
}
const mapStateToProps = state => {
  return {
    activeStep: {}
  };
};
const MaterialConfiguratorPlugin = connect(
  mapStateToProps,
  null
)(withNamespaces("MaterialConfigurator")(MaterialConfigurator));

module.exports = {
  MaterialConfigurator: assign(MaterialConfiguratorPlugin, {
    StepsConfigurator: {
      position: 2,
      priority: 1,
      type: "material"
    }
  })
};
