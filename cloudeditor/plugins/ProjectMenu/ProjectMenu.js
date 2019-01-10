const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
const ProjectMenuContainer = require("./components/ProjectMenuContainer");
require("./ProjectMenu.css");
class ProjectMenu extends React.Component {
  getTools = () => {
    return this.props.items.sort((a, b) => a.position - b.position);
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

const ProjectHeaderPlugin = connect(
  null,
  null
)(withNamespaces("projectMenu")(ProjectMenu));

module.exports = {
  ProjectMenu: assign(ProjectHeaderPlugin),
  reducers: { auth: require("./store/reducers") },
  epics: require("./store/epics")
};
