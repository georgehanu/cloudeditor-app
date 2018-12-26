const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");

const { titleSelector } = require("../../core/stores/selectors/project");

class ProjectHeader extends React.Component {
  render() {
    return (
      <div className="projectHeaderContainer">
        <div className="projectHeaderLogo" />
        <div className="projectHeaderCenter">
          <span className="projectHeaderTitle">
            {this.props.t("My project")}:
          </span>
          <span className="projectHeaderName">{this.props.projectTitle}</span>
          <span className="projectHeaderSeparator">|</span>
          <span className="projectHeaderPrint">
            {this.props.t("Print preview")}
          </span>
        </div>
        <div className="projectHeaderRight">
          <div className="projectRighInfo">
            <div className="projectRightPrice">
              25 {this.props.t("pieces")} 48.92 €
            </div>
            <div className="projectRrightDescription">
              Stadionzeitun DIN A5, 16 {this.props.t("pages")}
            </div>
          </div>
          <div className="projectRightAddContainer">
            <button className="projectRightAddContainerButton">
              {this.props.t("Add to cart")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projectTitle: titleSelector(state)
  };
};

const ProjectHeaderPlugin = connect(
  mapStateToProps,
  null
)(withNamespaces("projectHeader")(ProjectHeader));

module.exports = {
  ProjectHeader: assign(ProjectHeaderPlugin)
};
