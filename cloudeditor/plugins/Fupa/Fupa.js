const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const FupaBuilder = require("./FupaBuilder");
const isEqual = require("react-fast-compare");
const { withNamespaces } = require("react-i18next");

class Fupa extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    if (isEqual(nextState, this.state) && isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  };
  render() {
    return <FupaBuilder cfg={this.props.cfg} t={this.props.t} />;
  }
}

// let's export the plugin and a set of required reducers

const FupaPlugin = connect(
  null,
  null
)(withNamespaces("fupa")(Fupa));

module.exports = {
  Fupa: assign(FupaPlugin, {
    disablePluginIf: "{!store().getState().ui.permissions.allowFupa|0}",
    SideBar: {
      position: 1,
      priority: 1,
      text: "Fupa",
      icon: "FupaLogo",
      showMore: true,
      tooltip: { title: "Fupa", description: "Fupa net" }
    },
    cfg: {
      tableSizes: {
        Standings: { width: 75 },
        Matches: { width: 75 },
        Players: { width: 75 }
      }
    }
  }),
  reducers: { fupa: require("./store/reducers") },
  epics: require("./store/epics")
};
