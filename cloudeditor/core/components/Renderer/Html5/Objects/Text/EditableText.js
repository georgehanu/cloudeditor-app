const React = require("react");
const PropTypes = require("prop-types");
const { useState } = require("react");
const { withNamespaces } = require("react-i18next");

const ContentEditable = require("./useContentEditable");

function EditableText({ content, active, placeHolder }) {
  const [value, setValue] = useState(this.props.t(placeHolder));
  return <ContentEditable content={value} editable={active} tagName="div" />;
}

EditableText.propTypes = {
  content: PropTypes.string,
  active: PropTypes.bool,
  placeHolder: PropTypes.string
};
EditableText.defaultProps = {
  content: "",
  active: false,
  placeHolder: "Insert text Here!"
};

module.exports = withNamespaces("translate")(EditableText);
