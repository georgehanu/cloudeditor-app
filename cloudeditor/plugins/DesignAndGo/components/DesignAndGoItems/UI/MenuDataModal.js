import React, { Component } from "react";
import MenuHeader from "./MenuModalItems/MenuHeader";
import Fields from "../LayoutItems/Fields";
import Backdrop from "./Backdrop";
import { withNamespaces } from "react-i18next";

class MenuDataModal extends Component {
  render() {
    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div className="MenuDataModal">
          <MenuHeader modalClosed={this.props.modalClosed} title="Edit Label" />
          <div className="MenuDataModalContainer">
            <Fields />
          </div>
          <div className="MenuDataButton">
            <button>{this.props.t("Ok")}</button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default withNamespaces("designAndGo")(MenuDataModal);
