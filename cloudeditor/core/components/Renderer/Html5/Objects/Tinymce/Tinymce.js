const React = require("react");
const { Editor } = require("@tinymce/tinymce-react");
//const IframeComm = require("react-iframe-comm").default;
const { pathOr } = require("ramda");
require("./Tinymce.css");
const uuidv4 = require("uuid/v4");
const { connect } = require("react-redux");
const { debounce } = require("underscore");
const { withNamespaces } = require("react-i18next");

const ConfigUtils = require("../../../../../utils/ConfigUtils");

class Tinymce extends React.PureComponent {
  constructor(props) {
    super(props);
    this.tinyEditor = null;
    this.coverRef = React.createRef();

    this.pasteContent =
      `<div class="pasteTableContainer">` +
      props.t("Paste Your Table Here") +
      `</div>`;
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
    let result = {
      width: this.props.width / this.props.zoomScale,
      height: this.props.height / this.props.zoomScale
    };
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
    let result = {
      width: this.props.width / this.props.zoomScale,
      height: this.props.height / this.props.zoomScale
    };
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
    let result = {
      width: this.props.width / this.props.zoomScale,
      height: this.props.height / this.props.zoomScale
    };
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
    let result = {
      width: this.props.width / this.props.zoomScale,
      height: this.props.height / this.props.zoomScale
    };
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

  checkTableContent = () => {
    if (!this.props.tableContent.startsWith("<table")) return false;
    return true;
  };
  onFocusHandler = e => {
    if (this.tinyEditor) {
      if (!this.checkTableContent()) this.tinyEditor.setContent("");
      // const pasteTableContainers = this.tinyEditor
      //   .getDoc()
      //   .getElementsByClassName("pasteTableContainer");

      // if (pasteTableContainers.length) {
      //   const pasteTableContainer = pasteTableContainers[0];
      //   pasteTableContainer.remove();
      // }
    }
  };

  onBlurHandler = e => {
    if (this.tinyEditor) {
      if (!this.checkTableContent())
        this.tinyEditor.setContent(this.pasteContent);
    }
  };

  onEditorChangeHandler = event => {
    let content = this.tinyEditor.getContent();

    if (!content.startsWith("<table")) content = "";

    const tableSize = this.getTableSize(this.tinyEditor);

    this.props.onUpdateProps({
      id: this.props.id,
      props: {
        tableContent: content,
        width: tableSize.width,
        height: tableSize.height
      }
    });

    this.resetTableDim();
  };
  componentDidMount() {
    if (this.tinyEditor) {
      if (this.props.active) window.editor = this.tinyEditor;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.tinyEditor &&
      this.tinyEditor.selection.getNode() !== this.tinyEditor.getBody()
    ) {
      if (this.props.toolbarUpdate) {
        if (prevProps.bold !== this.props.bold)
          this.tinyEditor.execCommand("Bold");
        if (prevProps.italic !== this.props.italic)
          this.tinyEditor.execCommand("Italic");
        if (prevProps.underline !== this.props.underline)
          this.tinyEditor.execCommand("Underline");
        if (prevProps.fillColor !== this.props.fillColor)
          this.tinyEditor.execCommand(
            "ForeColor",
            false,
            "rgb(" + this.props.fillColor + ")"
          );
        if (prevProps.bgColor !== this.props.bgColor)
          this.tinyEditor.execCommand(
            "HiliteColor",
            false,
            "rgb(" + this.props.bgColor + ")"
          );
        if (prevProps.fontSize !== this.props.fontSize)
          this.tinyEditor.execCommand(
            "FontSize",
            false,
            this.props.fontSize / this.props.zoomScale + "px"
          );

        if (prevProps.textAlign !== this.props.textAlign) {
          if (this.props.textAlign == "left")
            this.tinyEditor.execCommand("JustifyLeft");
          if (this.props.textAlign == "center")
            this.tinyEditor.execCommand("JustifyCenter");
          if (this.props.textAlign == "right")
            this.tinyEditor.execCommand("JustifyRight");
          if (this.props.textAlign == "justify")
            this.tinyEditor.execCommand("JustifyFull");
        }
      }

      if (this.props.active) window.editor = this.tinyEditor;
      if (
        this.props.width != prevProps.width ||
        this.props.height != prevProps.height
      ) {
        const tableSize = this.getTableMinSize(this.tinyEditor);
        let update = null;

        if (
          tableSize.width >
          parseInt(this.props.width / this.props.zoomScale + 0.5)
        ) {
          update = { width: tableSize.width };
        }

        if (
          tableSize.height >
          parseInt(this.props.height / this.props.zoomScale + 0.5)
        ) {
          if (update) {
            update["height"] = tableSize.height;
          } else {
            update = { height: tableSize.height };
          }
        }

        if (update) {
          this.props.onUpdateProps({
            id: this.props.id,
            props: update
          });
        }
      }

      this.resetTableDim();
    }
  }

  componentWillUnmount() {
    this.tinyEditor = null;
    window.editor = null;
  }

  resetTableDim() {
    const { zoomScale, width, height, tableContent } = this.props;

    if (this.tinyEditor) {
      if (tableContent !== "") {
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
      } else {
        if (this.tinyEditor) {
          this.updateCss(
            this.tinyEditor.getDoc(),
            `
        body {           
            width: ` +
              width +
              `px !important;
          height: ` +
              height +
              `px !important;
              display: flex;
              justify-content: center;
              align-content: center;
              align-items: center;
              font-size: calc(100vw * 10 / 100);
        }`
          );
        }
      }
    }
  }

  onNodeChangeHandler = () => {
    if (this.tinyEditor) {
      const bold =
        this.tinyEditor.queryCommandValue("Bold") === "true" ? true : false;
      const italic =
        this.tinyEditor.queryCommandValue("Italic") === "true" ? true : false;
      const underline =
        this.tinyEditor.queryCommandValue("Underline") === "true"
          ? true
          : false;
      const fontSize = parseFloat(
        this.tinyEditor.queryCommandValue("FontSize")
      );
      const fontFamily = this.tinyEditor.queryCommandValue("FontName");
      const fillColor = {
        htmlRGB: this.tinyEditor
          .queryCommandValue("ForeColor")
          .replace("rgb(", "")
          .replace(")", "")
      };
      const bgColor = {
        htmlRGB: this.tinyEditor
          .queryCommandValue("HiliteColor")
          .replace("rgb(", "")
          .replace(")", "")
      };
      let textAlign = "left";
      if (this.tinyEditor.queryCommandValue("JustifyLeft") === "true")
        textAlign = "left";
      if (this.tinyEditor.queryCommandValue("JustifyCenter") === "true")
        textAlign = "center";
      if (this.tinyEditor.queryCommandValue("JustifyRight") === "true")
        textAlign = "right";
      if (this.tinyEditor.queryCommandValue("JustifyFull") === "true")
        textAlign = "justify";

      this.props.onUpdatePropsNoUndoRedo({
        id: this.props.id,
        props: {
          bold,
          italic,
          underline,
          textAlign,
          fontSize,
          fillColor: fillColor,
          bgColor: bgColor,
          fontFamily,
          toolbarUpdate: false
        }
      });
    }
  };

  render() {
    const globalConfig = ConfigUtils.getDefaults();
    const { width, height, tableContent, zoomScale } = this.props;
    let disableCover = null;

    if (this.props.viewOnly || !this.props.active) {
      disableCover = <div ref={this.coverRef} className="tinyMceCover" />;
    }

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
    } else {
      this.resetTableDim();
    }

    let pasteContent = this.pasteContent;
    if (this.tinyEditor && this.tinyEditor.hasFocus()) pasteContent = "";

    return (
      <React.Fragment>
        <Editor
          value={tableContent === "" ? pasteContent : tableContent}
          init={{
            plugins: "table autoresize paste",
            paste_retain_style_properties: "all",
            paste_webkit_styles: "all",
            paste_retain_style_properties: "all",
            paste_merge_formats: true,
            paste_preprocess: (plugin, args) => {
              if (!args.content.includes("<table")) {
                args.content = "";
                alert(this.props.t("You must paste a table"));
              } else {
                const tables = /<table(.*?)<\/table>/.exec(args.content);
                if (tables && tables.length) {
                  args.content = tables[0];
                  this.props.onUpdateProps({
                    id: this.props.id,
                    props: {
                      width: 1000,
                      height: 1000
                    }
                  });
                }
              }
            },
            toolbar: false,
            table_toolbar:
              "tableprops tabledelete | tablerowprops tableinsertrowbefore tableinsertrowafter tabledeleterow | tablecellprops tableinsertcolbefore tableinsertcolafter tabledeletecol",
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
          onFocus={this.onFocusHandler}
          onBlur={this.onBlurHandler}
          onNodeChange={this.onNodeChangeHandler}
          onEditorChange={this.onEditorChangeHandler}
          id={"Tiny" + this.props.uuid}
        />
        {disableCover}
      </React.Fragment>
    );
  }
}

module.exports = withNamespaces("translate")(Tinymce);
