const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");

require("./GraphicElements.css");

const GraphicElements = props => {
  return (
    <div className="graphicElementsContainer">
      <SidebarButton clicked={props.zoomIn}>
        <div className="iconContainer">
          <div className="icon fupa-graphics" />
        </div>
        <div className="iconTitle">{props.t("Graphic Elements")}</div>
      </SidebarButton>
    </div>
  );
};

const GraphicElementsPlugin = withNamespaces("graphicElements")(
  GraphicElements
);

module.exports = {
  GraphicElements: assign(GraphicElementsPlugin, {
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
