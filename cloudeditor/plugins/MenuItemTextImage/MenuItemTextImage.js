const React = require("react");
const assign = require("object-assign");
const { connect } = require("react-redux");

const { withNamespaces } = require("react-i18next");
const SubmenuText = require("./components/SubmenuText");
const SubmenuImage = require("./components/SubmenuImage");

class MenuItemTextImage extends React.Component {
  render() {
    return (
      <div className="menuItemTextImageContainer projectMenuItem">
        <div className="projectMenuItemHeader" />
        <div className="projectMenuItemContent">
          <SubmenuText />
          <SubmenuImage />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    //pagesLabel: pagesLabelSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //onChangePageHandler: payload => dispatch(changePage(payload))
  };
};

const MenuItemTextImagePlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemTextImage")(MenuItemTextImage));

module.exports = {
  MenuItemTextImage: assign(MenuItemTextImagePlugin, {
    ProjectMenu: {
      position: 3,
      priority: 1,
      text: "Text/Image insert"
    }
  })
};
