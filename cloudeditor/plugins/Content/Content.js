const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");

require("./Content.css");

const Content = props => {
  return (
    <div className="contentContainer">
      <SidebarButton clicked={props.zoomIn}>
        <div className="iconContainer">
          <div className="icon fupa-content" />
        </div>
        <div className="iconTitle">{props.t("Content")}</div>
      </SidebarButton>
    </div>
  );
};

const ContentPlugin = withNamespaces("content")(Content);

module.exports = {
  Content: assign(ContentPlugin, {
    SideBar: {
      position: 7,
      priority: 1,
      text: "zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  })
};
