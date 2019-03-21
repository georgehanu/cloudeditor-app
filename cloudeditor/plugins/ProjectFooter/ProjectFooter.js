const React = require("react");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");
const { connect } = require("react-redux");

require("./ProjectFooter.css");
const { infoBlockSelector } = require("../../core/stores/selectors/ui");
class ProjectFooter extends React.Component {
  render() {
    return (
      <div className="projectFooterContainer">
        <div dangerouslySetInnerHTML={{ __html: this.props.infoBlock }} />
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    infoBlock: infoBlockSelector(state)
  };
};
const ProjectFooterPlugin = connect(
  mapStateToProps,
  null
)(withNamespaces("projectFooter")(ProjectFooter));

module.exports = {
  ProjectFooter: assign(ProjectFooterPlugin)
};
