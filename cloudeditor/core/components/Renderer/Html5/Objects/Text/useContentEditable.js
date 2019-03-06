const React = require("react");
const { useEffect, useRef } = require("react");
const { escape } = require("underscore");

const { last } = require("ramda");

const PropTypes = require("prop-types");

const usePrevious = require("../../../../../hooks/usePrevious");

const useContentEditable = React.memo(function useContentEditable(props) {
  const _element = useRef(null);
  useEffect(() => {
    if (previousEditable && !props.editable) {
      //we have a blur event
      if (_element.current) {
        _onBlur(null);
      }
    }

    if (props.active) {
      _checkLastBr();
      setFocus();
      setCaret();
    }
  });

  const previousEditable = usePrevious(props.editable);

  const setFocus = () => {
    const { focus, editable } = props;
    if (_element.current && focus && editable) {
      _element.current.focus();
    }
  };

  const setCaret = () => {
    const { caretPosition, editable } = props;
    if (editable && caretPosition && _element.current) {
      const offset = content.length && caretPosition === "end" ? 1 : 0;
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(_element.current, offset);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const _computeResult = (type, others) => {
    /* const rawValue = escape(_element.current.innerText).replace(
      new RegExp("\\n$", "g"),
      ""
    ); */
    const rawValue = _element.current.innerText.replace(
      new RegExp("\\n$", "g"),
      ""
    );
    return {
      type,
      element: _element.current,
      text: rawValue,
      /*  width: _element.current.offsetWidth,
      height: _element.current.offsetHeight, */
      ...others
    };
  };

  const _onChange = event => {
    const result = _computeResult("change");
    props.onChange(result);

    if (_element.current) {
      const width = _element.current.offsetWidth;
      const height = _element.current.offsetHeight;

      const parent = _element.current.parentElement.parentElement;

      const parentWidth = parent.offsetWidth;
      const parentHeight = parent.offsetHeight;

      if (width > parentWidth || height > parentHeight) {
        props.onDimChange(result);
      }
    }
  };

  const _onBlur = event => {
    props.onBlur(_computeResult("blur"));
  };

  const { tagName: Element, editable, content, placeHolder, style } = props;

  const text = content && content.length > 0 ? content : placeHolder;

  _onPaste = ev => {
    ev.preventDefault();
    const text = ev.clipboardData.getData("text");
    document.execCommand("insertText", false, text);
    props.onPaste(_computeResult("paste"));
  };

  const _checkLastBr = () => {
    if (_element.current) {
      const editArea = _element.current;
      if (editArea.hasChildNodes()) {
        const childs = editArea.childNodes;
        const lastChild = last(childs);
        if (lastChild.nodeName.toLowerCase() !== "br") {
          br = document.createElement("br");
          editArea.insertAdjacentElement("beforeEnd", br);
        }
      }
    }
  };

  _onKeyDown = ev => {
    const { multiLine } = props;
    // return key
    if (!multiLine && ev.keyCode === 13) {
      ev.preventDefault();
      ev.currentTarget.blur();
      _checkLastBr();
      _onChange(null);
      return false;
      // Call onKeyUp directly as ev.preventDefault() means that it will not be called
    }

    if (multiLine && ev.keyCode === 13) {
      ev.preventDefault();
      if (window.getSelection) {
        var selection = window.getSelection(),
          range = selection.getRangeAt(0),
          br = document.createElement("br");
        range.deleteContents();
        range.insertNode(br);
        range.setStartAfter(br);
        range.setEndAfter(br);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      _checkLastBr();
      _onChange(null);
      return false;
    }
    _checkLastBr();
  };

  return (
    <Element
      id={props.id}
      ref={ref => {
        _element.current = ref;
        props.innerRef(ref);
      }}
      style={style}
      contentEditable={editable}
      dangerouslySetInnerHTML={{ __html: text }}
      className={props.className}
      onInput={_onChange}
      onBlur={_onBlur}
      onKeyDown={_onKeyDown}
      onPaste={_onPaste}
    />
  );
}, areEqual);

useContentEditable.propTypes = {
  content: PropTypes.string,
  placeHolder: PropTypes.string,
  editable: PropTypes.bool,
  focus: PropTypes.bool,
  maxLength: PropTypes.number,
  multiLine: PropTypes.bool,
  sanitise: PropTypes.bool,
  caretPosition: PropTypes.oneOf(["start", "end"]),
  tagName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]), // The element to make contenteditable. Takes an element string ('div', 'span', 'h1') or a styled component
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]), // The element to make contenteditable. Takes an element string ('div', 'span', 'h1') or a styled component
  innerRef: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onPaste: PropTypes.func,
  onChange: PropTypes.func,
  id: PropTypes.string,
  style: PropTypes.object
};
useContentEditable.defaultProps = {
  content: "",
  placeHolder: "Your Text Here!",
  editable: false,
  focus: false,
  maxLength: 999999999,
  multiLine: true,
  sanitise: true,
  caretPosition: "start",
  tagName: "div",
  active: false,
  onBlur: _ => _,
  onPaste: _ => _,
  onChange: _ => _,
  style: {}
};

const reduceTargetKeys = (target, keys, predicate) =>
  Object.keys(target).reduce(predicate, {});

const omit = (target = {}, keys = []) =>
  reduceTargetKeys(target, keys, (acc, key) =>
    keys.some(omitKey => omitKey === key) ? acc : { ...acc, [key]: target[key] }
  );

const pick = (target = {}, keys = []) =>
  reduceTargetKeys(target, keys, (acc, key) =>
    keys.some(pickKey => pickKey === key) ? { ...acc, [key]: target[key] } : acc
  );

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function areEqual(prevProps, nextProps) {
  const propKeys = Object.keys(nextProps).filter(
    key => key !== "content" && key !== "style"
  );
  return isEqual(pick(nextProps, propKeys), pick(prevProps, propKeys));
}

module.exports = useContentEditable;
