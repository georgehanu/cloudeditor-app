const React = require("react");
const MenuHeader = require("./MenuModalItems/MenuHeader");
const MenuLink = require("./MenuModalItems/MenuLink");

const Backdrop = require("./Backdrop");

class MenuModal extends React.Component {
  render() {
    const links = [
      { linkName: "Sign In", clicked: this.props.onSignInOpenHandler },
      { linkName: "Reset Your Design" },
      { linkName: "About Our Labels" },
      { linkName: "Pricing" },
      { linkName: "Refund Policy" },
      { linkName: "Privacy Policy" },
      { linkName: "Rerport a Bug" },
      { linkName: "Contact Us" }
    ];

    const items = links.map((el, index) => {
      return (
        <li key={index}>
          <MenuLink linkName={el.linkName} clicked={el.clicked} />
        </li>
      );
    });

    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div className="MenuModal">
          <MenuHeader modalClosed={this.props.modalClosed} title="MENU" />
          <div className="MenuLinks">
            <ul>{items}</ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

module.exports = MenuModal;
