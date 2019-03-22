const React = require("react");
const MenuHeader = require("./MenuModalItems/MenuHeader");
const Fields = require("../LayoutItems/Fields");
const Backdrop = require("./Backdrop");
const { withNamespaces } = require("react-i18next");

class MenuDataModal extends React.Component {
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
            <button onClick={this.props.modalClosed}>
              {this.props.t("Close")}
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

module.exports = withNamespaces("designAndGo")(MenuDataModal);
