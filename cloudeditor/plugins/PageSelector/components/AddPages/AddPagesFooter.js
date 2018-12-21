const React = require("react");
const { withNamespaces } = require("react-i18next");

const AddPagesFooter = props => {
  return (
    <div className="AddPagesFooter">
      <button onClick={props.addPages}>{props.t("ADD")}</button>
    </div>
  );
};

module.exports = withNamespaces("pageSelector")(AddPagesFooter);
