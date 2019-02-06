const React = require("react");
const assign = require("object-assign");
const ProjectMenuButton = require("../ProjectMenu/components/ProjectMenuButton");

const { withNamespaces } = require("react-i18next");

class MenuItemTable extends React.Component {
  render() {
    return (
      <div className="projectMenuButtonLink">
        <ProjectMenuButton
          active={this.props.active}
          onMouseEnter={this.props.onMouseEnter}
          onMouseLeave={this.props.onMouseLeave}
        >
          {this.props.t(this.props.text)}
        </ProjectMenuButton>
      </div>
    );
  }
}

const MenuItemTablePlugin = withNamespaces("menuItemTable")(MenuItemTable);

module.exports = {
  MenuItemTable: assign(MenuItemTablePlugin, {
    ProjectMenu: {
      position: 7,
      priority: 1,
      text: "Table insert",
      embedButtonPlugin: true,
      menuItemClass: "buttonMenuItemTable"
    }
  })
};
