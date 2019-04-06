const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
const {
  getSocketItemsSelector
} = require("../../../store/selectors/decorations");

require("./SocketConfigurator.css");
class SocketConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };

  render() {
    const sockets = this.props.socketItems.map((socket, index) => {
      return (
        <div className="socketItem" key={index}>
          <img src={socket.thumbnail_src} />
        </div>
      );
    });
    return <div className="socketConfiguratorContainer">{sockets}</div>;
  }
}
const mapStateToProps = state => {
  return {
    socketItems: getSocketItemsSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return {};
};

const SocketConfigratorConfiguratorPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("RelatedProductsConfigurator")(SocketConfigurator));

module.exports = {
  SocketConfigurator: assign(SocketConfigratorConfiguratorPlugin, {
    DecorationConfigurator: {
      position: 2,
      priority: 1,
      type: "sockets"
    }
  })
};
