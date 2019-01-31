const React = require("react");
const { Editor } = require("@tinymce/tinymce-react");
const { pathOr } = require("ramda");
require("./Tinymce.css");
const uuidv4 = require("uuid/v4");
const { connect } = require("react-redux");

const ConfigUtils = require("../../../../../utils/ConfigUtils");

class Tinymce extends React.Component {
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

  getTableSize1(editor, bodyClass) {
    let result = { width: null, height: null };

    if (!editor) return result;

    const body = editor.getBody();

    if (bodyClass != undefined) {
      this.addClass(body, bodyClass);
    }

    return result;
  }

  getTableSize(editor) {
    let result = { width: null, height: null };
    if (editor) {
      const table = editor.getDoc().getElementsByClassName("mce-item-table")[0];
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
      const body = editor.getBody();
      this.addClass(body, "minDimTable");
      const table = editor.getDoc().getElementsByClassName("mce-item-table")[0];
      if (table) {
        result["width"] = table.offsetWidth;
        result["height"] = table.offsetHeight;
      }
      this.removeClass(body, "minDimTable");
    }
    return result;
  }

  getTableAutoSize(editor) {
    let result = { width: null, height: null };
    if (editor) {
      const body = editor.getBody();
      this.addClass(body, "autoDimTable");
      const table = editor.getDoc().getElementsByClassName("mce-item-table")[0];
      if (table) {
        result["width"] = table.offsetWidth;
        result["height"] = table.offsetHeight;
      }
      this.removeClass(body, "autoDimTable");
    }
    return result;
  }

  setTableSize(editor, size) {
    if (editor) {
      const table = editor.getDoc().getElementsByClassName("mce-item-table")[0];
      if (table) {
        table.style =
          "width:" + size.width + "px; height:" + size.height + "px;";
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { width, height, tableContent, zoomScale, viewOnly } = this.props;
    /*     // if (this.tinyEditor && this.currentNode) {
    //   this.tinyEditor.editor.selection.setCursorLocation(this.currentNode, 1);
    // } */
    if (width > 0 && height > 0) {
      if (this.tinyEditor) {
        const newWidth = width / zoomScale;
        const newHeight = height / zoomScale;
        if (!viewOnly) {
          const tableSize = this.getTableAutoSize(this.tinyEditor.editor);
          if (tableSize.width > newWidth || tableSize.height > newHeight) {
            this.props.onUpdateProps({
              id: this.props.id,
              props: {
                width: Math.max(tableSize.width, newWidth),
                height: Math.max(tableSize.height, newHeight)
              }
            });
          }
        }
        this.setTableSize(this.tinyEditor.editor, {
          width: newWidth,
          height: newHeight
        });
      }
    }
  }

  onChangeHandler = (event, editor) => {
    if (editor) {
      var content = editor.getDoc().getElementsByClassName("tableContainer")[0]
        .innerHTML;

      const tableSize = this.getTableSize(editor);

      this.props.onUpdateProps({
        id: this.props.id,
        props: {
          tableContent: content,
          width: tableSize.width,
          height: tableSize.height
        }
      });
    }
  };

  onKeyUpHandler = (event, editor) => {
    if (editor) {
      this.currentNode = editor.selection.getNode();
      var content = editor.getDoc().getElementsByClassName("tableContainer")[0]
        .innerHTML;
      const tableSize = this.getTableSize(editor);

      this.props.onUpdateProps({
        id: this.props.id,
        props: {
          // tableContent: content,
          width: tableSize.width,
          height: tableSize.height
        }
      });
    }
  };

  getContentCss() {
    const globalConfig = ConfigUtils.getDefaults();
    let content_css = undefined;

    if (!PRODUCTION) {
      content_css = "http://localhost:8081/tinymce/resetTinyMceTable.css";
    } else {
      content_css =
        globalConfig.baseUrl +
        globalConfig.publicPath +
        "tinymce/resetTinyMceTable.css";
    }

    return content_css;
  }

  initCallbackHandler = editor => {
    if (this.props.viewOnly) {
      editor.setMode("readonly");
    }

    const tableSize = this.getTableAutoSize(editor);

    this.props.onUpdateProps({
      id: this.props.id,
      props: tableSize
    });
  };

  render() {
    const { width, height, tableContent, zoomScale } = this.props;
    let disableCover = null;

    if (this.props.viewOnly || !this.props.active) {
      disableCover = <div ref={this.coverRef} className="tinyMceCover" />;
    }

    return (
      <React.Fragment>
        <Editor
          value={this.props.tableContent}
          ref={node => (this.tinyEditor = node)}
          init={{
            plugins: "table autoresize paste",
            toolbar: false,
            content_css: this.getContentCss(),
            menubar: false,
            resize: !this.props.viewOnly,
            object_resizing: !this.props.viewOnly,
            body_class: "TinymceContainer",
            init_instance_callback: this.initCallbackHandler
          }}
          onEditorChange={this.onChangeHandler}
          onKeyUp={this.onKeyUpHandler}
          id={"Tiny" + this.props.uuid}
        />
        {disableCover}
      </React.Fragment>
    );
  }
}

module.exports = Tinymce;
