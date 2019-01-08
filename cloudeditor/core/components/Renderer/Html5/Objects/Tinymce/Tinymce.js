const React = require("react");
const TinyMCE = require("react-tinymce");
require("./Tinymce.css");
const uuidv4 = require("uuid/v4");
const { connect } = require("react-redux");

class Tinymce extends React.Component {
  state = {
    activeEditor: null,
    renderId: uuidv4()
  };
  constructor(props) {
    super(props);
    this.tinyEditor = null;
  }
  onChangeHandler = (event, data) => {};
  onObjectResizeHandler = (event, editor) => {
    var MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;
    var element = editor.dom.doc.getElementsByClassName(
      "mce-clonedresizable"
    )[0];

    var observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes") {
          const targetBounding = mutation.target.getBoundingClientRect();
          console.log({
            width: targetBounding.width / this.props.zoomScale,
            height: targetBounding.height / this.props.zoomScale
          });
          this.props.onUpdateProps({
            id: this.props.id,
            props: {
              width: targetBounding.width / this.props.zoomScale,
              height: targetBounding.height / this.props.zoomScale
            }
          });
        }
      });
    });

    observer.observe(element, {
      attributes: true //configure it to listen to attribute changes
    });
    event.target.parentElement.classList.add("hideTableResize");
    event.target.parentElement.parentElement.classList.add("hideResize");
  };
  onObjectResizedHandler = event => {
    event.target.parentElement.classList.remove("hideTableResize");
    event.target.parentElement.parentElement.classList.remove("hideResize");
    var table = this.currentEditor.dom.doc.getElementsByClassName(
      "mce-item-table"
    )[0];
    table.setAttribute(
      "style",
      "width:" +
        this.props.width / this.props.zoomScale +
        "px;height:" +
        this.props.height / this.props.zoomScale +
        "px;"
    );
    table.removeAttribute("data-mce-style");
  };

  componentDidUpdate() {
    if (this.currentEditor && this.currentEditor.dom.doc) {
      var element = this.currentEditor.dom.doc.getElementsByClassName(
        "tableContainer"
      )[0];
      var table = this.currentEditor.dom.doc.getElementsByClassName(
        "mce-item-table"
      )[0];
      element.setAttribute(
        "style",
        "transform:scale(" +
          this.props.zoomScale +
          ");width:" +
          this.props.width / this.props.zoomScale +
          "px;"
      );
      table.setAttribute(
        "style",
        "width:" + this.props.width / this.props.zoomScale + "px;"
      );
    }
  }

  initCallbackHandler = editor => {
    this.currentEditor = editor;
    var table = this.currentEditor.dom.doc.getElementsByClassName(
      "mce-item-table"
    )[0];
    this.props.onUpdateProps({
      id: this.props.id,
      props: {
        height: table.offsetHeight
      }
    });
  };

  render() {
    return (
      <TinyMCE
        content={
          "<div class='tableContainer' style='transform:scale(" +
          this.props.zoomScale +
          ");width:" +
          this.props.width / this.props.zoomScale +
          "px;" +
          ");'>" +
          this.props.tableContent +
          "</div>" //key={uuidv4()}
        }
        config={{
          plugins: "table autoresize",
          toolbar: "table",
          content_css: "/tinymce/resetTinyMceTable.css",
          menubar: false,
          resize: true,
          object_resizing: true,
          body_class: "TinymceContainer",
          init_instance_callback: this.initCallbackHandler
        }}
        ref={node => (this.tinyEditor = node)}
        init={{
          setup: editor => {
            this.setState({ activeEditor: editor });
          }
        }}
        onObjectResizeStart={this.onObjectResizeHandler}
        onObjectResized={this.onObjectResizedHandler}
        onChange={this.onChangeHandler}
        id={"Tiny" + this.props.uuid}
      />
    );
  }
}

module.exports = Tinymce;
