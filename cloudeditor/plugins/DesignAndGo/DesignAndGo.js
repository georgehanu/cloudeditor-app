import React from "react";
//import Layout from "../components/DesignAndGo/DesignAndGoItems/LayoutItems/Layout";
import Layout from "./components/DesignAndGoItems/LayoutItems/Layout";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { withNamespaces } from "react-i18next";
import MenuModal from "./components/DesignAndGoItems/UI/MenuModal";
import MenuDataModal from "./components/DesignAndGoItems/UI/MenuDataModal";
import SignInModal from "./components/DesignAndGoItems/UI/SignInModal";

import { I18nextProvider } from "react-i18next";
import i18next from "i18next";

import common_de from "./locales/en-US/designAndGo.json";
import common_en from "./locales/de-DE/designAndGo.json";

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: "en", // language to use
  resources: {
    en: {
      common: common_en // 'common' is our custom namespace
    },
    de: {
      common: common_de
    }
  }
});

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
      <I18nextProvider i18n={i18next}>
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
        </div>
      </I18nextProvider>
    );
  }
}

//const DesignAndGoPlugin = withNamespaces("designAndGo")(DesignAndGo);
const DesignAndGoPlugin = DesignAndGo;

//module.exports = {
export default {
  DesignAndGo: assign(DesignAndGoPlugin),
  reducers: { designAndGo: require("./stores/reducers") },
  epics: require("./stores/epics")
};
