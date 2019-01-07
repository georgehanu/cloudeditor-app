const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");

require("./Settings.css");

const Settings = props => {
  return (
    <div className="settingsContainer">
      <SidebarButton clicked={props.zoomIn}>
        <div className="iconContainer">
          <div className="icon fupa-settings" />
        </div>
        <div className="iconTitle">{props.t("Settings")}</div>
      </SidebarButton>
    </div>
  );
};

const SettingsPlugin = withNamespaces("settings")(Settings);

module.exports = {
  Settings: assign(SettingsPlugin, {
    SideBar: {
      position: 10,
      priority: 1,
      text: "zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  })
};
