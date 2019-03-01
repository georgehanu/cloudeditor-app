const React = require("react");

const ContentEditable = require("../ContentEditable/ContentEditable");

const editableText = props => {
  return (
    <ContentEditable
      content={
        !props.value.length && !props.active ? props.placeHolder : props.value
      }
      active={true}
      id={1}
      tagName="div"
      sanitise={true}
      multiLine={true}
    />
  );
};

module.exports = editableText;
