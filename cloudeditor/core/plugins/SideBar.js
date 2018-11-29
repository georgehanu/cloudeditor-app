const React = require("react");
const { connect } = require("react-redux");
const { createSelector } = require("reselect");
const PropTypes = require("prop-types");
const sidebarSelectors = require("../stores/selectors/sideBar");
const { withNamespaces } = require("react-i18next");
const logger = require("../utils/LoggerUtils");

const SideBarContainer = require("../containers/SideBarContainer");

class SideBar extends React.Component {
  getTools = () => {
    return this.props.items.sort((a, b) => a.position - b.position);
  };

  render() {
    const { expanded, active } = this.props;

    return (
      <SideBarContainer
        id={this.props.id}
        tools={this.getTools()}
        className={expanded ? "expanded" : ""}
      />
    );
  }
}

const selector = createSelector(
  [
    sidebarSelectors.sideBarExpandedSelector,
    sidebarSelectors.sideBarActiveSelector
  ],
  (expanded, active) => {
    return {
      expanded: expanded ? 1 : 0,
      active: active ? 1 : 0
    };
  }
);

SideBar.propTypes = {
  id: PropTypes.string,
  stateSelector: PropTypes.string
};

SideBar.defaultProps = {
  id: "sidebar-wrapper",
  items: [],
  stateSelector: "sidebar"
};

const SideBarPlugin = connect(selector)(withNamespaces("sideBar")(SideBar));

// let's export the plugin and a set of required reducers
module.exports = {
  SideBar: SideBarPlugin,
  reducers: {
    sideBar: require("../stores/reducers/sideBar")
  }
};
