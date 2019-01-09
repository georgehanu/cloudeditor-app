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

    const tableScale = this.props.width / this.props.tableWidth;
    element.style = "transform:scale(" + tableScale + ")";

    var observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === "attributes") {
          const targetBounding = mutation.target.getBoundingClientRect();

          this.props.onUpdateProps({
            id: this.props.id,
            props: {
              width:
                (this.props.width * mutation.target.offsetWidth) /
                this.props.tableWidth /
                this.props.zoomScale,
              height:
                (this.props.height * mutation.target.offsetHeight) /
                this.props.tableHeight /
                this.props.zoomScale,
              tableWidth: mutation.target.offsetWidth,
              tableHeight: mutation.target.offsetHeight
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
    // var table = this.currentEditor.dom.doc.getElementsByClassName(
    //   "mce-item-table"
    // )[0];

    // const tableOffsetWidth = table.offsetWidth;
    // table.setAttribute(
    //   "style",
    //   "width:" +
    //     this.props.width / this.props.zoomScale +
    //     "px;height:" +
    //     this.props.height / this.props.zoomScale +
    //     "px;" +
    //     "transform-origin: top left; " +
    //     "transform: scale(" +
    //     this.props.width / this.props.zoomScale / tableOffsetWidth +
    //     "); "
    // );
    // table.removeAttribute("data-mce-style");
  };

  componentDidUpdate() {
    if (this.currentEditor && this.currentEditor.dom.doc) {
      var table = this.currentEditor.dom.doc.getElementsByClassName(
        "mce-item-table"
      )[0];
      table.style =
        "width:" +
        this.props.tableWidth +
        "px; height:" +
        this.props.tableHeight +
        "px;";
    }
    /* if (this.currentEditor && this.currentEditor.dom.doc) {
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
          "px; height:0;"
      );

      const tableOffsetWidth = table.offsetWidth;
      console.log("tableOffsetWidth1", tableOffsetWidth);
      table.style =
        "width:" +
        this.props.width / this.props.zoomScale +
        "px;" +
        "transform-origin: top left; " +
        "transform: scale(" +
        this.props.width / this.props.zoomScale / tableOffsetWidth +
        "); ";
    } */
  }

  initCallbackHandler = editor => {
    this.currentEditor = editor;
    var table = this.currentEditor.dom.doc.getElementsByClassName(
      "mce-item-table"
    )[0];
    table.style =
      "width:" +
      this.props.tableWidth +
      "px; height:" +
      this.props.tableHeight +
      "px;";
  };

  render() {
    const tableScale = this.props.width / this.props.tableWidth;
    return (
      <React.Fragment>
        <TinyMCE
          content={
            "<div class='tableContainer' style='transform:scale(" +
            tableScale +
            ");width:" +
            this.props.width +
            "px; height:0;" +
            "'>" +
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
      </React.Fragment>
    );
  }
}

module.exports = Tinymce;
