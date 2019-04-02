const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const isEqual = require("react-fast-compare");
const Panel = require("./components/Panel.js");
const {
  getPanelsSelector,
  getPanelsOrderSelector
} = require("../store/selectors/lpf");
require("./PanelConfigurator.css");

class PanelConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };
  render() {
    let order = 1;
    const panels = this.props.panelsOrder.map((panelKey, index) => {
      return (
        <Panel
          order={order++}
          {...this.props.panels[panelKey]}
          key={panelKey}
        />
      );
    });
    return (
      <div className="panelConfiguratorContainer">
        {panels}
        <div className="addPanelsContainer">
          <span> {this.props.t("+ weitere Platte hunzufugen")}</span>
        </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    panels: getPanelsSelector(state),
    panelsOrder: getPanelsOrderSelector(state)
  };
};
const PanelConfiguratorPlugin = connect(
  mapStateToProps,
  null
)(withNamespaces("panelContainer")(PanelConfigurator));

module.exports = {
  PanelConfigurator: assign(PanelConfiguratorPlugin, {
    StepsConfigurator: {
      position: 1,
      priority: 1,
      type: "panels"
    }
  })
};
