const React = require("react");
const assign = require("object-assign");
const ProjectMenuButton = require("../ProjectMenu/components/ProjectMenuButton");

const { withNamespaces } = require("react-i18next");

class MenuItemManual extends React.Component {
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

const MenuItemManualPlugin = withNamespaces("menuItemManual")(MenuItemManual);

module.exports = {
  MenuItemManual: assign(MenuItemManualPlugin, {
    ProjectMenu: {
      position: 6,
      priority: 1,
      text: "Manual & Help",
      embedButtonPlugin: true,
      menuItemClass: "buttonMenuItemManual"
    }
  })
};
