const React = require("react");
//const { withNamespaces } = require("react-i18next");

const AddPagesHeader = props => {
  return (
    <div className="addPagesHeader">
      Add pages
      <div className="close">
        <a
          href="javascript:void(0)"
          className="closeMenu"
          onClick={e => {
            e.preventDefault();
            props.modalClosed();
          }}
        >
          close
        </a>
      </div>
    </div>
  );
};

//module.exports = withNamespaces("pageSelector")(AddPagesHeader);
module.exports = AddPagesHeader;
