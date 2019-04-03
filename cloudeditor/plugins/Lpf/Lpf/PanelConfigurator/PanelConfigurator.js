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
const {
  addPanel,
  removePanel,
  updatePanelProps
} = require("../store/actions/lpf");

class PanelConfigurator extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    return !isEqual(nextProps, this.props);
  };
  updateWidth = (id, value) => {
    this.props.updatePanelPropsHandler({
      id,
      props: {
        width: value
      }
    });
  };
  updateHeight = (id, value) => {
    this.props.updatePanelPropsHandler({
      id,
      props: {
        height: value
      }
    });
  };
  render() {
    let order = 1;
    const panels = this.props.panelsOrder.map((panelKey, index) => {
      return (
        <Panel
          order={order++}
          {...this.props.panels[panelKey]}
          key={panelKey}
          removePanelHandler={this.props.removePanelHandler}
          updateWidth={this.updateWidth}
          updateHeight={this.updateHeight}
          hasDelete={this.props.panelsOrder.length > 1 ? true : false}
        />
      );
    });
    return (
      <div className="panelConfiguratorContainer">
        {panels}
        <div
          className="addPanelsContainer"
          onClick={() => {
            this.props.addPanelHandler();
          }}
        >
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
const mapDispatchToProps = dispatch => {
  return {
    addPanelHandler: payload => dispatch(addPanel(payload)),
    removePanelHandler: payload => dispatch(removePanel(payload)),
    updatePanelPropsHandler: payload => dispatch(updatePanelProps(payload))
  };
};

const PanelConfiguratorPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
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
