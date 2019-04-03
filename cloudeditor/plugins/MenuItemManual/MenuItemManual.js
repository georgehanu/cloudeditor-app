const React = require("react");
const assign = require("object-assign");
const ProjectMenuButton = require("../ProjectMenu/components/ProjectMenuButton");
const ManualWnd = require("./components/ManualWnd");

const { withNamespaces } = require("react-i18next");

class MenuItemManual extends React.Component {
  state = {
    showManual: false
  };

  onCloseHandler = () => {
    this.setState({ showManual: false });
    this.props.onSetSubWndHandler(false);
  };

  onShowWnd = () => {
    this.props.onSetSubWndHandler(true);
    this.setState({ showManual: true });
  };

  render() {
    return (
      <React.Fragment>
        <div className="projectMenuButtonLink">
          <ProjectMenuButton
            active={this.props.active}
            clicked={this.onShowWnd}
            onMouseEnter={this.props.onMouseEnter}
            onMouseLeave={this.props.onMouseLeave}
          >
            {this.props.t(this.props.text)}
          </ProjectMenuButton>
        </div>
        {this.state.showManual && (
          <div className="manualContainer">
            <ManualWnd modalClosed={this.onCloseHandler} t={this.props.t} />
          </div>
        )}
      </React.Fragment>
    );
  }
}

const MenuItemManualPlugin = withNamespaces("menuItemManual")(MenuItemManual);

module.exports = {
  MenuItemManual: assign(MenuItemManualPlugin, {
    ProjectMenu: {
      position: 10,
      priority: 1,
      text: "Manual & Help",
      embedButtonPlugin: true,
      menuItemClass: "buttonMenuItemManual"
    }
  })
};
