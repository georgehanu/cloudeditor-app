const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");
const { changeBackground } = require("../../core/stores/actions/project");

require("./Background.css");
const Background = props => {
  return (
    <div
      className="backgroundContainer"
      onClick={() => {
        let background = document.getElementsByClassName("backgroundblock ");
        if (background.length) background[0].click();
      }}
    >
      <SidebarButton clicked={props.zoomIn}>
        <div className="iconContainer">
          <div className="icon fupa-background" />
        </div>
        <div className="iconTitle">{props.t("Background")}</div>
      </SidebarButton>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeBackgroundHandler: payload => dispatch(changeBackground(payload))
  };
};
const BackgroundPlugin = connect(
  null,
  mapDispatchToProps
)(withNamespaces("background")(Background));

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
