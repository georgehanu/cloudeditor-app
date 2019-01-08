const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");

require("./Asistent.css");

const Asistent = props => {
  return (
    <div className="asistentContainer">
      <SidebarButton clicked={props.zoomIn}>
        <div className="iconContainer">
          <div className="icon fupa-asistent" />
        </div>
        <div className="iconTitle">{props.t("Asistent")}</div>
      </SidebarButton>
    </div>
  );
};

const AsistentPlugin = withNamespaces("asistent")(Asistent);

module.exports = {
  Asistent: assign(AsistentPlugin, {
    SideBar: {
      position: 11,
      priority: 1,
      text: "zoom In",
      icon: "printqicon-zoom_in",
      showMore: false,
      embedButtonPlugin: true
    }
  })
};
