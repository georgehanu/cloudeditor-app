const React = require("react");
const { Editor } = require("@tinymce/tinymce-react");
//const IframeComm = require("react-iframe-comm").default;
const { pathOr } = require("ramda");
require("./Tinymce.css");
const uuidv4 = require("uuid/v4");
const { connect } = require("react-redux");
const { debounce } = require("underscore");

const ConfigUtils = require("../../../../../utils/ConfigUtils");

class Tinymce extends React.PureComponent {
  constructor(props) {
    super(props);
    this.tinyEditor = null;
    this.coverRef = React.createRef();
  }

  hasClass(el, className) {
    if (el.classList) return el.classList.contains(className);
    return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
  }

  addClass(el, className) {
    if (el.classList) el.classList.add(className);
    else if (!hasClass(el, className)) el.className += " " + className;
  }

  removeClass(el, className) {
    if (el.classList) el.classList.remove(className);
    else if (hasClass(el, className)) {
      var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
      el.className = el.className.replace(reg, " ");
    }
  }

  getTableSize(editor) {
    let result = { width: null, height: null };
    if (editor) {
      const table = editor.getDoc().querySelector("body > table");
      if (table) {
        result["width"] = table.offsetWidth;
        result["height"] = table.offsetHeight;
      }
    }
    return result;
  }

  getTableMinSize(editor) {
    let result = { width: null, height: null };
    if (editor) {
      this.updateCss(
        editor.getDoc(),
        `body{width:0px !important; height: 0px !important;} body > table{width:auto !important; height:auto !important;}`
      );
      const table = editor.getDoc().querySelector("body > table");
      if (table) {
        result["width"] = table.offsetWidth;
        result["height"] = table.offsetHeight;
      }
    }
    return result;
  }

  getTableAutoSize(editor) {
    let result = { width: null, height: null };
    if (editor) {
      this.updateCss(
        editor.getDoc(),
        `body{width:10000px !important; height: 10000px !important;} body > table{width:auto !important; height:auto !important;}`
      );
      const table = editor.getDoc().querySelector("body > table");
      if (table) {
        result["width"] = table.offsetWidth;
        result["height"] = table.offsetHeight;
      }
    }
    return result;
  }

  getTableRealSize(editor) {
    let result = { width: null, height: null };
    if (editor) {
      const table = editor.getDoc().querySelector("body > table");

      let width = table.style.width;
      let height = table.style.height;

      width = width ? width : "auto";
      height = height ? height : "auto";

      this.updateCss(
        editor.getDoc(),
        `body{width:10000px !important; height: 10000px !important;} body > table{width:` +
          width +
          ` !important; height:` +
          height +
          ` !important;}`
      );
      if (table) {
        result["width"] = table.offsetWidth;
        result["height"] = table.offsetHeight;
      }
    }
    return result;
  }

  updateBlockDimByTable(type) {
    if (this.props.width && this.props.height) return null;
    let tableSize = null;
    switch (type) {
      case "min":
        tableSize = this.getTableMinSize(this.tinyEditor);
        break;
      case "normal":
        tableSize = this.getTableSize(this.tinyEditor);
        break;
      case "auto":
        tableSize = this.getTableAutoSize(this.tinyEditor);
        break;
      default:
        tableSize = this.getTableRealSize(this.tinyEditor);
        break;
    }

    const update = this.getUpdateTableSize(tableSize);

    if (update) {
      this.props.onUpdateProps({
        id: this.props.id,
        props: tableSize
      });
    }

    return tableSize;
  }

  getUpdateTableSize(tableSize) {
    let update = null;
    if (tableSize) {
      if (!this.props.width) update = { width: tableSize.width };
      if (!this.props.height)
        if (update) update["height"] = tableSize.height;
        else update = { height: tableSize.height };
    }
    return update;
  }

  updateCss(document, css) {
    console.log(css);
    const styleId = "editorStyle";

    var prevStyleEl = document.getElementById(styleId);
    if (prevStyleEl) prevStyleEl.remove();
    var head = document.getElementsByTagName("head")[0];
    var s = document.createElement("style");
    s.setAttribute("type", "text/css");
    s.setAttribute("id", "editorStyle");
    if (s.styleSheet) {
      // IE
      s.styleSheet.cssText = css;
    } else {
      // the world
      s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
  }

  onInitHandler = e => {
    this.tinyEditor = e.target;

    const tableSize = this.updateBlockDimByTable();
    let { width, height, zoomScale } = this.props;
    width = width / zoomScale;
    height = height / zoomScale;
    if (tableSize) {
      const { width, height } = tableSize;
    }

    this.updateCss(
      this.tinyEditor.getDoc(),
      `
      body {
        transform:scale(` +
        zoomScale +
        `); 
          width: ` +
        width +
        `px !important;
        height: ` +
        height +
        `px !important;
      }
      table {
        width: ` +
        100 +
        `% !important;
        height: ` +
        100 +
        `% !important;
      }`
    );

    window.editor = e.target;
  };

  onEditorChangeHandler = () => {
    var content = this.tinyEditor.getContent();

    const tableSize = this.getTableRealSize(this.tinyEditor);

    this.props.onUpdateProps({
      id: this.props.id,
      props: {
        tableContent: content,
        width: tableSize.width,
        height: tableSize.height
      }
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.width != prevProps.width ||
      this.props.height != prevProps.height
    ) {
      const tableSize = this.getTableMinSize(this.tinyEditor);
      const update = this.getUpdateTableSize(tableSize);

      if (update) {
        this.props.onUpdateProps({
          id: this.props.id,
          props: tableSize
        });
      }
    }

    this.resetTableDim();
  }

  componentWillUnmount() {
    console.log("will unmount");
    this.tinyEditor = null;
  }

  resetTableDim() {
    console.log("reset", this.tinyEditor, this.props.viewOnly);
    const { zoomScale, width, height } = this.props;

    if (this.tinyEditor) {
      this.updateCss(
        this.tinyEditor.getDoc(),
        `
        body {
          transform:scale(` +
          zoomScale +
          `); 
            width: ` +
          width / zoomScale +
          `px !important;
          height: ` +
          height / zoomScale +
          `px !important;
        }
        table {
          width: ` +
          100 +
          `% !important;
          height: ` +
          100 +
          `% !important;
        }`
      );
    }
  }

  render() {
    const globalConfig = ConfigUtils.getDefaults();
    const { width, height, tableContent, zoomScale } = this.props;
    let disableCover = null;

    if (this.props.viewOnly || !this.props.active) {
      disableCover = <div ref={this.coverRef} className="tinyMceCover" />;
    }

    this.resetTableDim();

    if (this.props.viewOnly) {
      return (
        <div
          className="dummyTableContainer"
          style={{
            width: width / zoomScale,
            height: height / zoomScale,
            transform: "scale(" + zoomScale + ")"
          }}
          dangerouslySetInnerHTML={{ __html: tableContent }}
        />
      );
    }

    return (
      <React.Fragment>
        <Editor
          value={tableContent}
          init={{
            plugins: "table autoresize paste",
            toolbar: false,
            content_css:
              globalConfig.baseUrl +
              globalConfig.publicPath +
              "tinymce/resetTinyMceTable.css",
            menubar: false,
            resize: !this.props.viewOnly,
            object_resizing: !this.props.viewOnly,
            body_class: "TinymceContainer"
          }}
          onInit={this.onInitHandler}
          onEditorChange={this.onEditorChangeHandler}
          id={"Tiny" + this.props.uuid}
        />
        {disableCover}
      </React.Fragment>
    );
  }
}

module.exports = Tinymce;
