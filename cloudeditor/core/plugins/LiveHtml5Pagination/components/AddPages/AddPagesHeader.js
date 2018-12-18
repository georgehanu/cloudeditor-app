const React = require("react");
const { withNamespaces } = require("react-i18next");

const AddPagesHeader = props => {
  return (
    <div className="addPagesHeader">
      Add pages
      <div className="close">
        <a
          href="#"
          className="closeMenu"
          onClick={e => {
            e.preventDefault();
            props.modalClosed();
          }}
        />
      </div>
    </div>
  );
};

//module.exports = withNamespaces("pageSelector")(AddPagesHeader);
module.exports = AddPagesHeader;
