const React = require("react");
const { connect } = require("react-redux");
const assign = require("object-assign");
const ProjectMenuContainer = require("./components/ProjectMenuContainer");

require("./ProjectMenu.css");
class ProjectMenu extends React.Component {
  getTools = () => {
    return this.props.items.sort((a, b) => a.position - b.position);
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    return false;
  };

  render() {
    return (
      <ProjectMenuContainer
        tools={this.getTools()}
        addContainerClasses={this.props.addContainerClasses}
      />
    );
  }
}

const ProjectHeaderPlugin = ProjectMenu;

module.exports = {
  ProjectMenu: assign(ProjectHeaderPlugin),
  epics: require("./store/epics")
};
