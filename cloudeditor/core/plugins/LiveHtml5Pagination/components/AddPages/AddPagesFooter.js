const React = require("react");
const { withNamespaces } = require("react-i18next");

const AddPagesFooter = props => {
  return (
    <div className="addPagesFooter">
      <button onClick={props.addPages}>{props.t("ADD")}</button>
    </div>
  );
};
module.exports = withNamespaces("translate")(AddPagesFooter);
