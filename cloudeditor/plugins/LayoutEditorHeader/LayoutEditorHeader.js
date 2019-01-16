const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");
const assign = require("object-assign");

require("./LayoutEditorHeader.css");
class LayoutEditorHeader extends React.Component {
  render() {
    return <div className="layoutEditorHeaderContainer">Text</div>;
  }
}

const mapStateToProps = state => {
  return {
    //projectTitle: titleSelector(state),
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

const LayoutEditorHeaderPlugin = connect(
  mapStateToProps,
  mapDispatchToProps
)(withNamespaces("layoutEditorHeader")(LayoutEditorHeader));

module.exports = {
  LayoutEditorHeader: assign(LayoutEditorHeaderPlugin)
};
