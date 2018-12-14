"use strict";

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _createReactClass = require("create-react-class");

var _createReactClass2 = _interopRequireDefault(_createReactClass);

var _lodashIsEqual = require("lodash/isEqual");

var _lodashIsEqual2 = _interopRequireDefault(_lodashIsEqual);

var _lodashClone = require("lodash/clone");

var _lodashClone2 = _interopRequireDefault(_lodashClone);

var _helpersUuid = require("../helpers/uuid");

var _helpersUuid2 = _interopRequireDefault(_helpersUuid);

var _helpersUcFirst = require("../helpers/ucFirst");

var _helpersUcFirst2 = _interopRequireDefault(_helpersUcFirst);

// Include all of the Native DOM and custom events from:
// https://github.com/tinymce/tinymce/blob/master/tools/docs/tinymce.Editor.js#L5-L12
var EVENTS = [
  "focusin",
  "focusout",
  "click",
  "dblclick",
  "mousedown",
  "mouseup",
  "mousemove",
  "mouseover",
  "beforepaste",
  "paste",
  "cut",
  "copy",
  "selectionchange",
  "mouseout",
  "mouseenter",
  "mouseleave",
  "keydown",
  "keypress",
  "keyup",
  "contextmenu",
  "dragend",
  "dragover",
  "draggesture",
  "dragdrop",
  "drop",
  "drag",
  "BeforeRenderUI",
  "SetAttrib",
  "PreInit",
  "PostRender",
  "init",
  "deactivate",
  "activate",
  "NodeChange",
  "BeforeExecCommand",
  "ExecCommand",
  "show",
  "hide",
  "ProgressState",
  "LoadContent",
  "SaveContent",
  "BeforeSetContent",
  "SetContent",
  "BeforeGetContent",
  "GetContent",
  "VisualAid",
  "remove",
  "submit",
  "reset",
  "BeforeAddUndo",
  "AddUndo",
  "change",
  "undo",
  "redo",
  "ClearUndos",
  "ObjectSelected",
  "ObjectResizeStart",
  "ObjectResized",
  "PreProcess",
  "PostProcess",
  "focus",
  "blur",
  "dirty"
];

// Note: because the capitalization of the events is weird, we're going to get
// some inconsistently-named handlers, for example compare:
// 'onMouseleave' and 'onNodeChange'
var HANDLER_NAMES = EVENTS.map(function(event) {
  return "on" + (0, _helpersUcFirst2["default"])(event);
});

var TinyMCE = (0, _createReactClass2["default"])({
  displayName: "TinyMCE",

  propTypes: {
    config: _propTypes2["default"].object,
    content: _propTypes2["default"].string,
    id: _propTypes2["default"].string,
    className: _propTypes2["default"].string,
    name: _propTypes2["default"].string
  },

  getDefaultProps: function getDefaultProps() {
    return {
      config: {},
      content: ""
    };
  },

  componentWillMount: function componentWillMount() {
    this.id = this.id || this.props.id || (0, _helpersUuid2["default"])();
  },

  componentDidMount: function componentDidMount() {
    var config = (0, _lodashClone2["default"])(this.props.config);
    this._init(config, this.props.content);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if (
      !(0, _lodashIsEqual2["default"])(this.props.config, nextProps.config) ||
      !(0, _lodashIsEqual2["default"])(this.props.id, nextProps.id)
    ) {
      this.id = nextProps.id;
      this._init(
        (0, _lodashClone2["default"])(nextProps.config),
        nextProps.content
      );
      return;
    }

    // TODO: This will fix problems with keeping internal state, but causes problems with cursor placement
    // if (!isEqual(this.props.content, nextProps.content)) {
    //   const editor = tinymce.EditorManager.get(this.id);
    //   editor.setContent(nextProps.content);
    //
    //   editor.selection.select(editor.getBody(), true);
    //   editor.selection.collapse(false);
    // }
  },

  shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
    return !(0, _lodashIsEqual2["default"])(
      this.props.config,
      nextProps.config
    );
  },

  componentWillUnmount: function componentWillUnmount() {
    this._remove();
  },

  render: function render() {
    return this.props.config.inline
      ? _react2["default"].createElement("div", {
          id: this.id,
          className: this.props.className,
          dangerouslySetInnerHTML: { __html: this.props.content }
        })
      : _react2["default"].createElement("textarea", {
          id: this.id,
          className: this.props.className,
          name: this.props.name,
          defaultValue: this.props.content
        });
  },

  _init: function _init(config, content) {
    var _this = this;

    if (this._isInit) {
      this._remove();
    }

    // hide the textarea that is me so that no one sees it
    (0, _reactDom.findDOMNode)(this).style.hidden = "hidden";

    var setupCallback = config.setup;
    var hasSetupCallback = typeof setupCallback === "function";

    config.selector = "#" + this.id;
    config.setup = function(editor) {
      EVENTS.forEach(function(eventType, index) {
        editor.on(eventType, function(e) {
          var handler = _this.props[HANDLER_NAMES[index]];
          if (typeof handler === "function") {
            // native DOM events don't have access to the editor so we pass it here
            handler(e, editor);
          }
        });
      });
      // need to set content here because the textarea will still have the
      // old `this.props.content`
      if (typeof content !== "undefined") {
        editor.on("init", function() {
          editor.setContent(content);
        });
      }
      if (hasSetupCallback) {
        setupCallback(editor);
      }
    };

    tinymce.init(config);

    (0, _reactDom.findDOMNode)(this).style.hidden = "";

    this._isInit = true;
  },

  _remove: function _remove() {
    tinymce.EditorManager.execCommand("mceRemoveEditor", true, this.id);
    this._isInit = false;
  }
});

// add handler propTypes
HANDLER_NAMES.forEach(function(name) {
  TinyMCE.propTypes[name] = _propTypes2["default"].func;
});

module.exports = TinyMCE;
