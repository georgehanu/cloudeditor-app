const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");

require("./Background.css");

const Background = props => {
  return (
    <div className="backgroundContainer">
      <SidebarButton clicked={props.zoomIn}>
        <div className="iconContainer">
          <div className="icon fupa-background" />
        </div>
        <div className="iconTitle">{props.t("Background")}</div>
      </SidebarButton>
    </div>
  );
};

const BackgroundPlugin = withNamespaces("background")(Background);

module.exports = {
  Background: assign(BackgroundPlugin, {
    SideBar: {
      position: 8,
      priority: 1,
      text: "zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  })
};
