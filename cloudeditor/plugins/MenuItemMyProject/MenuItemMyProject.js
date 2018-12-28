const React = require("react");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
require("./MenuItemMyProject.css");
class MenuItemMyProject extends React.Component {
  render() {
    return (
      <div className="menuItemMyProjectContainer projectMenuItem">
        <div className="projectMenuItemHeader" />
        <div className="projectMenuItemContent">
          <ul>
            <li className="submenuItem">{this.props.t("Save")}</li>
            <li className="submenuItem">{this.props.t("Load")}</li>
            <li className="submenuItem">
              {this.props.t("Send draft by e-mail")}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const MenuItemMyProjectPlugin = withNamespaces("menuItemMyProject")(
  MenuItemMyProject
);

module.exports = {
  MenuItemMyProject: assign(MenuItemMyProjectPlugin, {
    ProjectMenu: {
      position: 1,
      priority: 1,
      text: "My Project",
      tooltip: { title: "Fupa", description: "Fupa.net" }
    }
  })
};
