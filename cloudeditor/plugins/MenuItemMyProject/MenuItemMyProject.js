const React = require("react");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const { authLoggedInSelector } = require("../ProjectMenu/store/selectors");
const { connect } = require("react-redux");
const LoginWnd = require("./components/LoginWnd");
const SaveWnd = require("./components/SaveWnd");
const LoadWnd = require("./components/LoadWnd");

require("./MenuItemMyProject.css");
class MenuItemMyProject extends React.Component {
  state = {
    showLoginWnd: false,
    showSaveWnd: false,
    showLoadWnd: false,
    loginMode: false
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.active === false)
      return {
        ...prevState,
        showLoginWnd: false,
        showSaveWnd: false,
        showLoadWnd: false
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

  closeWnd = () => {
    this.setState({
      showLoginWnd: false,
      showSaveWnd: false,
      showLoadWnd: false
    });
    this.props.onSetSubWndHandler(false);
  };

  showSaveWnd = () => {
    this.setState({ showSaveWnd: true });
    this.props.onSetSubWndHandler(true);
  };

  showLoadWnd = () => {
    this.setState({ showLoadWnd: true });
    this.props.onSetSubWndHandler(true);
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
          <li className="submenuItem" onClick={this.showLoadWnd}>
            {this.props.t("Load")}
          </li>
          <li className="submenuItem">
            {this.props.t("Send draft by e-mail")}
          </li>
        </React.Fragment>
      );
    }

    const showSubmenu =
      this.state.showLoginWnd === false &&
      this.state.showSaveWnd === false &&
      this.state.showLoadWnd === false;

    return (
      <React.Fragment>
        {this.state.showLoginWnd && (
          <LoginWnd show={true} modalClosed={this.closeWnd} />
        )}
        {this.state.showSaveWnd && (
          <SaveWnd show={true} modalClosed={this.closeWnd} />
        )}
        {this.state.showLoadWnd && (
          <LoadWnd show={true} modalClosed={this.closeWnd} />
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
