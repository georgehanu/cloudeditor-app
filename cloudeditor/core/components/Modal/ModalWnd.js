const React = require("react");
const Backdrop = require("../Backdrop/Backdrop");
const HeaderWnd = require("./HeaderWnd/HeaderWnd");

const modalWnd = props => {
  return (
    <div className="loginContainer">
      <Backdrop show={props.show} clicked={props.clicked} />
      <div className={props.className}>
        <div className="loginWndContainer">
          <HeaderWnd modalClosed={props.clicked} title={props.title} />
          {props.children}
        </div>
      </div>
    </div>
  );
};

module.exports = modalWnd;
