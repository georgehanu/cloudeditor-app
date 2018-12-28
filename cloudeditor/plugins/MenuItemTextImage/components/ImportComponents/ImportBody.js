const React = require("react");
const { withNamespaces } = require("react-i18next");
const ImportItem = require("./ImportItem");
const withSpinner = require("../../../../core/hoc/withSpinner/withSpinner");

const importBody = props => {
  const items = props.page.map((el, index) => {
    return (
      <ImportItem
        {...el}
        checked={props.textSelectedId === el.id}
        textSelected={props.textSelected}
        key={index}
        isText={props.isText}
      />
    );
  });
  return (
    <div className={props.isText ? "importTextBody" : "importImageBody"}>
      <ul>{items}</ul>
    </div>
  );
};

module.exports = withNamespaces("menuItemTextImage")(withSpinner(importBody));
