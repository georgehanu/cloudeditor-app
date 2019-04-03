const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");
const { updateObjectProps } = require("../../core/stores/actions/project");
const { head } = require("ramda");
const {
  selectedObjectSelector
} = require("../../core/stores/selectors/project");

require("./MakeEditable.css");
const MakeEditable = props => {
  const selected = Object.keys(props.selectedObject.objects).length;
  const firstKey = head(Object.keys(props.selectedObject.objects));
  return (
    <div
      className="editableUneditableContainer"
      onClick={() => {
        const selected = Object.keys(props.selectedObject.objects).length;
        if (selected) {
          const firstKey = head(Object.keys(props.selectedObject.objects));
          let editable = !props.selectedObject.objects[firstKey].editable;
          if (
            typeof props.selectedObject.objects[firstKey].editable ===
            "undefined"
          ) {
            editable = false;
          }
          if (selected)
            props.updateObjectProps({
              id: props.selectedObject.objects[firstKey].id,
              props: {
                editable,
                movable: editable,
                rotatable: editable,
                resizable: editable,
                deletable: editable
              }
            });
        }
      }}
    >
      <SidebarButton
        tooltip={{
          title: "Make Editable/Uneditable",
          description: "Make Editable/Uneditable"
        }}
        selected={selected}
      >
        <div className="iconContainer">
          <div className="icon printqicon-edit" />
        </div>
        <div className="iconTitle">
          {selected && !props.selectedObject.objects[firstKey].editable
            ? props.t("Uneditable")
            : props.t("Editable")}
        </div>
      </SidebarButton>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    selectedObject: selectedObjectSelector(state)
  };
};
const mapDispatchToProps = dispatch => {
  return { updateObjectProps: payload => dispatch(updateObjectProps(payload)) };
};
const MakeEditablePlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("translate")(MakeEditable));

module.exports = {
  MakeEditable: assign(MakeEditablePlugin, {
    SideBar: {
      position: 9,
      priority: 1,
      text: "zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  })
};
