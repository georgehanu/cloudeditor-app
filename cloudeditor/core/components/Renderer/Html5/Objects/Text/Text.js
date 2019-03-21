const React = require("react");
const { useMemo, useCallback, useState, useRef, useEffect } = require("react");
const { escape, unescape } = require("underscore");
const { withNamespaces } = require("react-i18next");
const uuidv4 = require("uuid/v4");

const usePrevious = require("../../../../../hooks/usePrevious");
const DummyText = require("./DummyText");
const EditableText = require("./EditableText");

const ContentEditable = require("./useContentEditable");

require("./Text.css");

function computeLineHeight(lineheightp, lineheightn) {
  let lineHeight = 1.2;
  const lineHeightP = parseFloat(lineheightp);
  const lineHeightN = parseFloat(lineheightn);
  if (!isNaN(lineHeightP)) {
    if (lineHeightP >= 50) lineHeight = lineHeightP / 100;
    else lineHeight = lineHeightP;
  } else if (!isNaN(lineHeightN)) {
    lineHeight = lineHeightN;
  }
  return lineHeight;
}

function computeStyle(
  fontFamily,
  fillColor,
  fontSize,
  textAlign,
  bold,
  italic,
  underline,
  vAlign,
  lineHeight
) {
  return {
    fontFamily: fontFamily,
    color: "rgb(" + fillColor + ")",
    fontSize: fontSize + "px",
    textAlign: textAlign,
    fontWeight: bold ? "bold" : "normal",
    fontStyle: italic ? "italic" : "normal",
    textDecoration: underline ? "underline" : "none",
    verticalAlign: vAlign,
    lineHeight: lineHeight
  };
}

const Text = props => {
  let contentEditable = false;
  if (props.contentEditable | 0) contentEditable = true;
  const [content, setContent] = useState(props.value);
  const [renderId, setRenderId] = useState(uuidv4());

  const _editableRef = useRef(null);

  if (contentEditable) {
  }

  const {
    id,
    zoomScale,
    fontFamily,
    fillColor,
    fontSize,
    textAlign,
    bold,
    italic,
    underline,
    vAlign,
    lineheightn,
    lineheightp,
    value,
    placeHolder,
    active,
    onUpdateProps,
    realWidth,
    realHeight
  } = props;

  const _areDimChanged = () => {
    result = false;
    if (_editableRef.current) {
      const width = _editableRef.current.offsetWidth;
      const height = _editableRef.current.offsetHeight;

      let isUpdate = false;
      let newWidth = realWidth;
      let newHeight = realHeight;

      if (width > realWidth) {
        newWidth = width;
        isUpdate = true;
      }

      if (height > realHeight) {
        newHeight = height;
        isUpdate = true;
      }

      if (isUpdate)
        result = {
          width: newWidth,
          height: newHeight
        };
    }
    return result;
  };

  const _checkDim = () => {
    if (_editableRef.current) {
      const newDims = _areDimChanged();
      if (newDims) {
        onUpdateProps({
          id: id,
          props: { ...newDims }
        });
      }
    }
  };

  const lineHeight = useMemo(
    () => computeLineHeight(lineheightp, lineheightn),
    [lineheightn, lineheightp]
  );

  const style = useMemo(
    () =>
      computeStyle(
        fontFamily,
        fillColor,
        fontSize,
        textAlign,
        bold,
        italic,
        underline,
        vAlign,
        lineHeight
      ),
    [
      bold,
      fillColor,
      fontFamily,
      fontSize,
      italic,
      lineHeight,
      textAlign,
      underline,
      vAlign
    ]
  );

  useEffect(() => {
    if (contentEditable) _checkDim();
  }, [
    content,
    value,
    fontFamily,
    fontSize,
    bold,
    realWidth,
    realHeight,
    lineHeight
  ]);
  useEffect(() => {
    setContent(value);
    setRenderId(uuidv4());
  }, [value]);

  const onChangeHandler = result => {
    setContent(result.text);
  };
  const onDimChangeHandler = result => {
    return;
    onUpdateProps({
      id: id,
      props: {
        value: result.text
      }
    });
  };

  const onBlurHandler = result => {
    if (content !== props.value)
      onUpdateProps({
        id: id,
        props: {
          value: content,
          renderId: uuidv4()
        }
      });
  };

  const getInnerRef = ref => {
    _editableRef.current = ref;
  };

  let minWidth = { minWidth: realWidth + "px" };
  if (props.resizing | 0) minWidth = {};

  const textContent = contentEditable ? (
    <ContentEditable
      id={id}
      innerRef={getInnerRef}
      renderId={renderId}
      content={content}
      placeHolder={props.t(placeHolder)}
      active={active}
      editable={contentEditable && active}
      onBlur={onBlurHandler}
      onChange={onChangeHandler}
      onDimChange={onDimChangeHandler}
      onPaste={onChangeHandler}
      focus={true}
      caretPosition="start"
      className={"editArea"}
    />
  ) : (
    <DummyText id={id} content={value} className={"editArea"} />
  );

  return (
    <div style={style} className="blockData">
      {textContent}
    </div>
  );
};

function areEqual(prevProps, nextProps) {
  let contentEditable = false;
  if (nextProps.contentEditable | 0) contentEditable = true;

  if (!contentEditable && (nextProps.resizing | 0 || nextProps.active | 0))
    return true;
  return false;
}

module.exports = withNamespaces("translate")(React.memo(Text, areEqual));
