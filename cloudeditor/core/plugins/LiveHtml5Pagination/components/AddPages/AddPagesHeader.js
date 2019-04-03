const React = require("react");
const { withNamespaces } = require("react-i18next");

const AddPagesHeader = props => {
  return (
    <div className="addPagesHeader">
      {props.t("Add pages")}
      <div className="close">
        <a
          href="javascript:void(0)"
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

module.exports = withNamespaces("translate")(AddPagesHeader);
//module.exports = AddPagesHeader;
