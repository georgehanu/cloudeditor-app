const React = require("react");
const assign = require("object-assign");
const ProjectMenuButton = require("../ProjectMenu/components/ProjectMenuButton");
const SweetAlert = require("sweetalert-react").default;

const { withNamespaces } = require("react-i18next");

class MenuItemCancel extends React.Component {
  state = {
    showAlert: false
  };

  onCancelHandler() {
    window.history.back();
  }

  render() {
    return (
      <React.Fragment>
        <SweetAlert
          show={this.state.showAlert}
          type="warning"
          title={this.props.t("Warning")}
          text={this.props.t("Are you sure you want to leave the editor ?")}
          showCancelButton={true}
          onConfirm={() => this.onCancelHandler()}
          onCancel={() => this.setState({ showAlert: false })}
        />
        <div className="projectMenuButtonLink">
          <ProjectMenuButton
            active={this.props.active}
            clicked={() => {
              this.setState({ showAlert: true });
            }}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
          >
            {this.props.t(this.props.text)}
          </ProjectMenuButton>
        </div>
      </React.Fragment>
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
