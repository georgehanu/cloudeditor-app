const SidebarButton = require("../components/sidebar/SidebarButton");
const PaneContainer = require("../components/sidebar/PaneContainer");
const ToggleSidebar = require("../components/sidebar/ToggleSidebar");
const React = require("react");
const PropTypes = require("prop-types");

class SideBarContainer extends React.Component {
  state = {
    showPane: false,
    pluginIndex: null,
    expanded: true
  };
  getToolConfig = tool => {
    if (tool.tool) {
      return {};
    }
    return this.props.toolCfg || {};
  };

  getTool = tool => {
    return tool.plugin;
  };

  showPlugin = pluginIndex => {
    if (this.state.showPane && this.state.pluginIndex === pluginIndex) {
      this.setState({ showPane: false, pluginIndex: null });
      this.props.addContainerClasses("SideBar", []);
    } else {
      this.setState({ showPane: true, pluginIndex });
      this.props.addContainerClasses("SideBar", ["SidebarContainerExpand"]);
    }
  };

  toggleSidebarExpanded = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  renderTools = () => {
    return this.props.tools.map((tool, i) => {
      const Tool = this.getTool(tool);
      const toolCfg = this.getToolConfig(tool);
      console.log(tool, "Toold");

      const iconStyle = "icon " + (tool.icon ? tool.icon : "");
      return (
        <li key={i} className="SidebarButtonContainer">
          {tool.embedButtonPlugin === true ? (
            <Tool {...toolCfg} items={tool.items || []} />
          ) : (
            <React.Fragment>
              <SidebarButton
                clicked={() => this.showPlugin(i)}
                selected={i === this.state.pluginIndex ? true : false}
                tooltip={tool.tooltip}
              >
                <div className="IconContainer">
                  <div className={iconStyle} />
                </div>
                <div className="IconTitle">{tool.text}</div>
                {tool.showMore && (
                  <span className="icon More printqicon-lefttriangle" />
                )}
                <div className="RightTriangle" />
              </SidebarButton>
              <PaneContainer
                visible={i === this.state.pluginIndex ? true : false}
                clicked={() => this.showPlugin(i)}
              >
                <Tool {...toolCfg} items={tool.items || []} />
              </PaneContainer>
            </React.Fragment>
          )}
        </li>
      );
    });
  };

  render() {
    const Container = this.props.container;
    const className =
      this.props.className +
      " " +
      (this.state.expanded ? "SidebarExpanded" : "SidebarMinimized");
    return (
      <div id={this.props.id} className={className}>
        <div id={this.props.id + "-container"} style={this.props.style}>
          <ToggleSidebar
            clicked={this.toggleSidebarExpanded}
            expanded={this.state.expanded}
          />
          <ul>{this.renderTools()}</ul>
        </div>
      </div>
    );
  }
}

SideBarContainer.propTypes = {
  tools: PropTypes.array
};
SideBarContainer.defaultProps = {
  tools: []
};

module.exports = SideBarContainer;
