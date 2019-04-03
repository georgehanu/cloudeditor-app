const React = require("react");
const UncontrolledInput = require("../../components/UncontrolledInput/UncontrolledInput");
const { withNamespaces } = require("react-i18next");

const panel = props => {
  let deleteHandler = null;
  if (props.hasDelete) {
    deleteHandler = (
      <div className="deletePanel">
        <div
          onClick={() => {
            props.removePanelHandler({ id: props.id });
          }}
        >
          x
        </div>
      </div>
    );
  }
  return (
    <div className="panelContainer">
      <div className="panelArea panelTitle">
        {props.t(props.label.replace("%panel_no%", props.order))}:
      </div>
      <div className=" panelArea panelWidth">
        <label htmlFor={"width_panel_" + props.id}>{props.t("Width")}</label>
        <UncontrolledInput
          displayedValue={props.width}
          defaultValue={props.width}
          id={"width_panel_" + props.id}
          objId={props.id}
          changeInput={props.updateWidth}
        />
      </div>
      <div className="panelArea panelHeight">
        <label htmlFor={"height_panel_" + props.id}>{props.t("Height")}</label>
        <UncontrolledInput
          displayedValue={props.width}
          defaultValue={props.width}
          id={"height_panel_" + props.id}
          objId={props.id}
          changeInput={props.updateHeight}
        />
      </div>
      {deleteHandler}
    </div>
  );
};

module.exports = withNamespaces("panel")(panel);
