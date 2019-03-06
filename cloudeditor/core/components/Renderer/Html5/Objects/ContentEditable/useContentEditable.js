const React = require("react");
const { useState, useEffect, useRef } = require("react");

function useContentEditable(props) {
  const _element = useRef(null);
  useEffect(() => {
    //setValue(props.content);
    //setFocus();
    //setCaret();
  });

  const setFocus = () => {
    _element.current.focus();
  };

  const setCaret = () => {
    const { caretPosition } = props;
    if (caretPosition && _element.current) {
      const offset = value.length && caretPosition === "end" ? 1 : 0;
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(_element.current, offset);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const _onChange = event => {
    const rawValue = _element.current.innerText;
  };

  const { tagName: Element, editable, content } = props;

  return (
    <Element
      ref={_element}
      contentEditable={editable}
      dangerouslySetInnerHTML={{ __html: content }}
      onInput={_onChange}
    />
  );
}

function areEqual(prevProps, nextProps) {
  console.log("areEquals");
  return true;
}

module.exports = React.memo(useContentEditable, areEqual);
