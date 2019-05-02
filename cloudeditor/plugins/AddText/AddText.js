const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");
const uuidv4 = require("uuid/v4");
const { addObjectMiddle } = require("../../core/stores/actions/project");

require("./AddText.css");

const AddText = props => {
  return (
    <div className="addTextContainer">
      <SidebarButton
        clicked={() => {
          props.onClickAddBlockHandler({
            subType: "textflow",
            type: "text",
            id: uuidv4(),
            fontFamily: "Times New Roman"
          });
        }}
        tooltip={{ title: "Add Text", description: "Add a new text block" }}
      >
        <div className="iconContainer">
          <div className="icon printqicon-newtext" />
        </div>
        <div className="iconTitle">{props.t("Add Text")}</div>
      </SidebarButton>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onClickAddBlockHandler: payload => dispatch(addObjectMiddle(payload))
  };
};

const AddTextPlugin = connect(
  null,
  mapDispatchToProps
)(withNamespaces("addText")(AddText));

module.exports = {
  AddText: assign(AddTextPlugin, {
    SideBar: {
      position: 1,
      priority: 1,
      text: "zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  })
};
