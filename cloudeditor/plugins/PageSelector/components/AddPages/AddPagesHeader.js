const React = require("react");
const { withNamespaces } = require("react-i18next");

const AddPagesHeader = props => {
  return (
    <div className="AddPagesHeader">
      {props.t("Add pages")}

      <div className="close">
        <a
          href="#"
          className="CloseMenu"
          onClick={e => {
            e.preventDefault();
            props.modalClosed();
          }}
        />
      </div>
    </div>
  );
};

module.exports = withNamespaces("pageSelector")(AddPagesHeader);
