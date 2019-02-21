const React = require("react");
const Layout = require("./components/DesignAndGoItems/LayoutItems/Layout");

require("slick-carousel/slick/slick.css");
require("slick-carousel/slick/slick-theme.css");

const { withNamespaces } = require("react-i18next");
const MenuModal = require("./components/DesignAndGoItems/UI/MenuModal");
const MenuDataModal = require("./components/DesignAndGoItems/UI/MenuDataModal");
const SignInModal = require("./components/DesignAndGoItems/UI/SignInModal");
const AlternateLayouts = require("./components/AlternateLayouts");

const assign = require("object-assign");

class DesignAndGo extends React.Component {
  state = {
    menuOpened: false,
    dataOpened: false,
    signInOpened: false
  };

  onMenuCloseHandler = () => {
    this.setState({
      menuOpened: false,
      dataOpened: false,
      signInOpened: false
    });
  };
  onMenuOpenHandler = () => {
    this.setState({ menuOpened: true });
  };
  onDataOpenHandler = () => {
    this.setState({ dataOpened: true });
  };
  onSignInOpenHandler = () => {
    this.setState({ menuOpened: false, signInOpened: true });
  };

  render() {
    return (
      <div className="DesignAndGo cloudeditor">
        <div className="DesignAndGoMenu">
          {this.state.menuOpened && (
            <MenuModal
              show={this.state.menuOpened}
              modalClosed={this.onMenuCloseHandler}
              onSignInOpenHandler={this.onSignInOpenHandler}
            />
          )}
          {this.state.dataOpened && (
            <MenuDataModal
              show={this.state.dataOpened}
              modalClosed={this.onMenuCloseHandler}
            />
          )}
        </div>
        {this.state.signInOpened && (
          <SignInModal
            show={this.state.signInOpened}
            modalClosed={this.onMenuCloseHandler}
          />
        )}

        <Layout
          onMenuOpenHandler={this.onMenuOpenHandler}
          onDataOpenHandler={this.onDataOpenHandler}
        />
        <AlternateLayouts />
      </div>
    );
  }
}

const DesignAndGoPlugin = withNamespaces("designAndGo")(DesignAndGo);

module.exports = {
  DesignAndGo: assign(DesignAndGoPlugin),
  reducers: {
    designAndGo: require("./store/reducers/general"),
    alternateLayouts: require("./store/reducers/alternateLayouts")
  },
  epics: require("./store/epics")
};
