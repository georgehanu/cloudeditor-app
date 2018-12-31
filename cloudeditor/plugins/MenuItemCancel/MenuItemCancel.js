const React = require("react");
const assign = require("object-assign");
const ProjectMenuButton = require("../ProjectMenu/components/ProjectMenuButton");

const { withNamespaces } = require("react-i18next");

class MenuItemCancel extends React.Component {
  render() {
    return (
      <div className="projectMenuButtonLink">
        <ProjectMenuButton active={this.props.active}>
          {this.props.t(this.props.text)}
        </ProjectMenuButton>
      </div>
    );
  }
}

const MenuItemCancelPlugin = withNamespaces("menuItemCancel")(MenuItemCancel);

module.exports = {
  MenuItemCancel: assign(MenuItemCancelPlugin, {
    ProjectMenu: {
      position: 5,
      priority: 1,
      text: "Cancel",
      embedButtonPlugin: true,
      menuItemClass: "buttonMenuItemCancel"
    }
  })
};
