const React = require("react");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const { authLoggedInSelector } = require("../ProjectMenu/store/selectors");
const { connect } = require("react-redux");
const LoginWnd = require("./components/LoginWnd");
const SaveWnd = require("./components/SaveWnd");

require("./MenuItemMyProject.css");
class MenuItemMyProject extends React.Component {
  state = {
    showLoginWnd: false,
    showSaveWnd: false,
    loginMode: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.active === false)
      return {
        ...prevState,
        showLoginWnd: false,
        showSaveWnd: false
      };

    if (nextProps.loggedIn === true || prevState.loginMode === false) {
      nextProps.onSetSubWndHandler(false);
      return {
        ...prevState,
        showLoginWnd: false,
        loginMode: true
      };
    }
    return prevState;
  }

  showLoginWnd = () => {
    this.setState({ showLoginWnd: true });
    this.props.onSetSubWndHandler(true);
  };

  closeLoginWnd = () => {
    this.setState({ showLoginWnd: false });
    this.props.onSetSubWndHandler(false);
  };

  showSaveWnd = () => {
    this.setState({ showSaveWnd: true });
    this.props.onSetSubWndHandler(true);
  };

  closeSaveWnd = () => {
    this.setState({ showSaveWnd: false });
    this.props.onSetSubWndHandler(false);
  };

  render() {
    let items = (
      <li className="submenuItem" onClick={this.showLoginWnd}>
        {this.props.t("Login")}
      </li>
    );

    if (this.props.loggedIn) {
      items = (
        <React.Fragment>
          <li className="submenuItem" onClick={this.showSaveWnd}>
            {this.props.t("Save")}
          </li>
          <li className="submenuItem">{this.props.t("Load")}</li>
          <li className="submenuItem">
            {this.props.t("Send draft by e-mail")}
          </li>
        </React.Fragment>
      );
    }

    const showSubmenu =
      this.state.showLoginWnd === false && this.state.showSaveWnd === false;

    return (
      <React.Fragment>
        {this.state.showLoginWnd && (
          <LoginWnd show={true} modalClosed={this.closeLoginWnd} />
        )}
        {this.state.showSaveWnd && (
          <SaveWnd show={true} modalClosed={this.closeSaveWnd} />
        )}
        {showSubmenu && (
          <div className="menuItemMyProjectContainer projectMenuItem">
            <div className="projectMenuItemHeader" />
            <div className="projectMenuItemContent">
              <ul>{items}</ul>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: authLoggedInSelector(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const MenuItemMyProjectPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("menuItemMyProject")(MenuItemMyProject));

module.exports = {
  MenuItemMyProject: assign(MenuItemMyProjectPlugin, {
    ProjectMenu: {
      position: 1,
      priority: 1,
      text: "My Project"
    }
  })
};
