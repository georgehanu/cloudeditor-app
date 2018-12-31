const ProjectMenuButton = require("./ProjectMenuButton");
const React = require("react");

class ProjectMenuContainer extends React.Component {
  state = {
    menuItemActive: null,
    subWndOpened: false
  };

  getTool = tool => {
    return tool.plugin;
  };

  onMouseEnterHandler = index => {
    this.setState({ menuItemActive: index });
  };
  onMouseLeaveHandler = index => {
    if (this.state.subWndOpened) return;
    this.setState({ menuItemActive: null });
  };

  onSetSubWndHandler = value => {
    this.setState({ subWndOpened: value });
  };

  renderTools = () => {
    return this.props.tools.map((tool, i) => {
      const Tool = this.getTool(tool);

      return (
        <li
          key={i}
          className={
            "projectMenuButtonContainer " +
            (tool.menuItemClass || "") +
            (i === this.state.menuItemActive
              ? " projectMenuButtonContainerActive"
              : "")
          }
          onMouseEnter={() => this.onMouseEnterHandler(i)}
          onMouseLeave={() => this.onMouseLeaveHandler(i)}
        >
          {tool.embedButtonPlugin === true ? (
            <Tool
              cfg={tool.cfg || {}}
              items={tool.items || []}
              text={tool.text}
              index={i}
              active={i === this.state.menuItemActive}
            />
          ) : (
            <React.Fragment>
              <ProjectMenuButton active={i === this.state.menuItemActive}>
                {tool.text}
              </ProjectMenuButton>
              <Tool
                cfg={tool.cfg || {}}
                items={tool.items || []}
                index={i}
                active={true}
                onSetSubWndHandler={this.onSetSubWndHandler}
              />
            </React.Fragment>
          )}
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
