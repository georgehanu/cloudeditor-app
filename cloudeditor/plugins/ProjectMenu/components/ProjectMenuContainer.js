const ProjectMenuButton = require("./ProjectMenuButton");
const React = require("react");

class ProjectMenuContainer extends React.Component {
  state = {
    menuItemActive: null
  };

  getTool = tool => {
    return tool.plugin;
  };

  onMouseEnterHandler = index => {
    this.setState({ menuItemActive: index });
  };
  onMouseLeaveHandler = index => {
    this.setState({ menuItemActive: null });
  };

  renderTools = () => {
    return this.props.tools.map((tool, i) => {
      const Tool = this.getTool(tool);

      return (
        <li
          key={i}
          className="projectMenuButtonContainer"
          onMouseEnter={() => this.onMouseEnterHandler(i)}
          onMouseLeave={() => this.onMouseLeaveHandler(i)}
        >
          <ProjectMenuButton active={i === this.state.menuItemActive}>
            {tool.text}
          </ProjectMenuButton>
          <Tool cfg={tool.cfg || {}} items={tool.items || []} index={i} />
        </li>
      );
    });
  };

  render() {
    return (
      <div className="projectMenuContainer">
        <ul className="projectMenuContainerUl">{this.renderTools()}</ul>
      </div>
    );
  }
}

module.exports = ProjectMenuContainer;
