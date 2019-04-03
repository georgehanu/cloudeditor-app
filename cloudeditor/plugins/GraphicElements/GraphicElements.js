const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const { withNamespaces } = require("react-i18next");
const SidebarButton = require("../../core/plugins/Sidebar/components/subcomponents/SidebarButton");
const Gallery = require("../../core/components/Gallery/Gallery");

require("./GraphicElements.css");
const TYPE = "graphics";
const GraphicElements = props => {
  return (
    <div className="graphicElementsContainer">
      <Gallery type={TYPE} addContainerClasses={props.addContainerClasses} />
    </div>
  );
};

const GraphicElementsPlugin = withNamespaces("graphicElements")(
  GraphicElements
);

module.exports = {
  GraphicElements: assign(GraphicElementsPlugin, {
    disablePluginIf: "{!store().getState().ui.permissions.allowGraphics|0}",
    SideBar: {
      position: 9,
      priority: 1,
      text: "Graphic Elements",
      icon: "fupa-graphics",
      showMore: true,
      tooltip: { title: "Graphics", description: "Add a new Graphic element" }
    }
  })
};
