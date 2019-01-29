const SidebarButton = require("./subcomponents/SidebarButton");
const PaneContainer = require("./subcomponents/PaneContainer");
const ToggleSidebar = require("./subcomponents/ToggleSidebar");
const React = require("react");
const PropTypes = require("prop-types");
const { rerenderPage } = require("../../../../core/utils/UtilUtils");
const isEqual = require("react-fast-compare");

class SideBarContainer extends React.Component {
  state = {
    showPane: false,
    pluginIndex: null,
    expanded: true
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (isEqual(nextState, this.state) && isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  };

  getTool = tool => {
    return tool.plugin;
  };

  showPlugin = pluginIndex => {
    if (this.state.showPane && this.state.pluginIndex === pluginIndex) {
      this.setState({ showPane: false, pluginIndex: null }, () => {
        this.props.addContainerClasses("sideBar", [], true);
      });
    } else {
      this.setState({ showPane: true, pluginIndex }, () => {
        this.props.addContainerClasses(
          "sideBar",
          ["sidebarContainerExpand"],
          true
        );
      });
    }
  };

  toggleSidebarExpanded = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  renderTools = () => {
    return this.props.tools.map((tool, i) => {
      const Tool = this.getTool(tool);
      const iconStyle = "icon " + (tool.icon ? tool.icon : "");
      return (
        <li key={i} className="sidebarButtonContainer">
          {tool.embedButtonPlugin === true ? (
            <Tool cfg={tool.cfg || {}} items={tool.items || []} />
          ) : (
            <React.Fragment>
              <SidebarButton
                clicked={() => this.showPlugin(i)}
                selected={i === this.state.pluginIndex ? true : false}
                tooltip={tool.tooltip}
              >
                <div className="iconContainer">
                  <div className={iconStyle} />
                </div>
                <div className="iconTitle">{tool.text}</div>
                {tool.showMore && (
                  <span className="icon more printqicon-lefttriangle" />
                )}
                <div className="rightTriangle" />
              </SidebarButton>
              <PaneContainer
                visible={i === this.state.pluginIndex ? true : false}
                clicked={() => this.showPlugin(i)}
              >
                <Tool
                  cfg={tool.cfg || {}}
                  items={tool.items || []}
                  addContainerClasses={this.props.addContainerClasses}
                />
              </PaneContainer>
            </React.Fragment>
          )}
        </li>
      );
    });
  };

  render() {
    const className =
      this.props.className +
      " " +
      (this.state.expanded ? "sidebarExpanded" : "sidebarMinimized");
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
