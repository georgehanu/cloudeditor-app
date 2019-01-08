const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");

require("./Advertising.css");

const Advertising = props => {
  return (
    <div className="advertisingContainer">
      <SidebarButton clicked={props.zoomIn}>
        <div className="iconContainer">
          <div className="icon fupa-advertise" />
        </div>
        <div className="iconTitle">{props.t("Advertising")}</div>
      </SidebarButton>
    </div>
  );
};

const AdvertisingPlugin = withNamespaces("advertising")(Advertising);

module.exports = {
  Advertising: assign(AdvertisingPlugin, {
    SideBar: {
      position: 6,
      priority: 1,
      text: "zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  })
};
