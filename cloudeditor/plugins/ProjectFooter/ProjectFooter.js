const React = require("react");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");

require("./ProjectFooter.css");
class ProjectFooter extends React.Component {
  render() {
    return <div className="projectFooterContainer">Footer</div>;
  }
}

const ProjectFooterPlugin = withNamespaces("projectFooter")(ProjectFooter);

module.exports = {
  ProjectFooter: assign(ProjectFooterPlugin)
};
