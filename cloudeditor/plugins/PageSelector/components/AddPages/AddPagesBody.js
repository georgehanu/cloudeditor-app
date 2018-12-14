const React = require("react");
const { withNamespaces } = require("react-i18next");

const AddPagesBody = props => {
  const checkboxes = props.checkboxes.map((el, index) => {
    return (
      <div className="AddPagesLocationRow" key={index}>
        <input
          type="radio"
          value={el.value}
          checked={props.checkboxesSelected === el.value}
          onChange={() => props.onCheckboxChanged(el.value)}
        />
        <span onClick={() => props.onCheckboxChanged(el.value)}>
          {el.label}
        </span>
      </div>
    );
  });
  return (
    <div className="AddPagesBody">
      <div className="AddPagesNumber">
        <span>{props.t("Add")}</span>
        <input
          type="number"
          className="AddPagesNumberInput"
          value={props.nrPagesToInsert}
          onChange={props.changePagesToInsert}
        />
        <span>{props.t("pages")}</span>
      </div>
      <div className="AddPagesLocation">{checkboxes}</div>
    </div>
  );
};

module.exports = withNamespaces("pageSelector")(AddPagesBody);
