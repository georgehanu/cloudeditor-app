const React = require("react");
//const { withNamespaces } = require("react-i18next");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const { withNamespaces } = require("react-i18next");
const {
  activePageIdSelector
} = require("../../../../stores/selectors/project");
const {
  displayedPageLabelsSelector
} = require("../../../../stores/selectors/Html5Renderer");

const AddPagesBody = props => {
  const checkboxes = props.checkboxes.map((el, index) => {
    return (
      <div className="addPagesLocationRow" key={index}>
        <input
          type="radio"
          className="importTextItemRadio"
          id={"pageLabel_" + index}
          value={el.value}
          checked={props.checkboxesSelected === el.value}
          onChange={() => props.onCheckboxChanged(el.value)}
        />
        <label
          htmlFor={"pageLabel_" + index}
          className="itemLabel"
          dangerouslySetInnerHTML={{
            __html: props
              .t(el.label)
              .replace("page_label", props.t(props.pageLabels.shortLabel))
          }}
        />
      </div>
    );
  });
  return (
    <div className="addPagesBody">
      <div className="addPagesNumber">
        <span>{props.t("Add")}</span>
        <input
          type="number"
          className="addPagesNumberInput"
          value={props.nrPagesToInsert}
          onChange={props.changePagesToInsert}
        />
        <span>{props.t("pages")}</span>
      </div>
      <div className="addPagesLocation">{checkboxes}</div>
    </div>
  );
};

//module.exports = withNamespaces("pageSelector")(AddPagesBody);
const makeMapStateToProps = (state, props) => {
  const getDisplayedPageLabelsSelector = displayedPageLabelsSelector(
    activePageIdSelector
  );
  const mapStateToProps = (state, props) => {
    return {
      pageLabels: getDisplayedPageLabelsSelector(state, props)
    };
  };
  return mapStateToProps;
};
const AddPagesBodyComponent = hot(module)(
  connect(
    makeMapStateToProps,
    null
  )(AddPagesBody)
);
module.exports = withNamespaces("translate")(AddPagesBodyComponent);
