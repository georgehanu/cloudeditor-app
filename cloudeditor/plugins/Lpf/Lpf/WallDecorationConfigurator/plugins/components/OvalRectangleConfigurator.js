const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
const {
  getOvalRectangleSelector
} = require("../../../store/selectors/decorations");

require("./OvalRectangleConfigurator.css");
class OvalRectangleConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };

  render() {
    const items = this.props.ovalRectangleItems.map((item, index) => {
      return (
        <div className="ovalRectangleItem" key={index}>
          {item.label}
        </div>
      );
    });
    return <div className="ovalRectangleConfiguratorContainer">{items}</div>;
  }
}
const mapStateToProps = state => {
  return {
    ovalRectangleItems: getOvalRectangleSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};

const SocketConfigratorConfiguratorPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("RelatedProductsConfigurator")(OvalRectangleConfigurator));

module.exports = {
  OvalRectangleConfigurator: assign(SocketConfigratorConfiguratorPlugin, {
    DecorationConfigurator: {
      position: 2,
      priority: 1,
      type: "cutouts"
    }
  })
};
