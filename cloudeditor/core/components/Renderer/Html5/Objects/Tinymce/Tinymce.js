const React = require("react");
const { Editor } = require("@tinymce/tinymce-react");
//const IframeComm = require("react-iframe-comm").default;
const { pathOr } = require("ramda");
require("./Tinymce.css");
const uuidv4 = require("uuid/v4");
const { connect } = require("react-redux");

class Tinymce extends React.Component {
  constructor(props) {
    super(props);
    this.tinyEditor = null;
    this.currentEditor = null;
    this.coverRef = React.createRef();
  }

  attributes = {
    src:
      "http://work.cloudlab.at:9012/pa/cewe_tables/htdocs/cloudeditorScripts/tinyMceIframe.php",
    width: "0",
    height: "0",
    frameBorder: 0
  };
  onReceiveMessage = message => {
    const table = pathOr(null, ["data", "table"], message);
    if (table) {
      if (table.width === -1 || table.height === -1)
        if (
          this.props.tableWidth === table.width &&
          this.props.tableHeight === table.height
        )
          return;
      this.props.onUpdateProps({
        id: this.props.id,
        props: {
          tableWidth: table.width,
          tableHeight: table.height
        }
      });
    }
  };
  onReady = () => {};

  onChangeHandler = (event, data) => {
    var content = data.getDoc().getElementsByClassName("tableContainer")[0]
      .innerHTML;

    this.props.onUpdateProps({
      id: this.props.id,
      props: {
        content
      }
    });

    console.log("onChangeHandler", content);
  };

  onClickHandler = event => {
    console.log("onClick");
    event.preventDefault();
  };
  onObjectResizeHandler = (event, editor) => {
    var MutationObserver =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver;
    var element = editor.dom.doc.getElementsByClassName(
      "mce-clonedresizable"
    )[0]; // element resize by handle

    if (element) {
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
    }
  };
  onObjectResizedHandler = event => {
    event.target.parentElement.classList.remove("hideTableResize");
    event.target.parentElement.parentElement.classList.remove("hideResize");
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
    if (this.props.viewOnly) {
      editor.setMode("readonly");
    }

    var table = editor.getDoc().getElementsByClassName("mce-item-table")[0];
    if (table) {
      table.style =
        "width:" +
        this.props.tableWidth +
        "px; height:" +
        this.props.tableHeight +
        "px;";
    }
  };

  onMouseEnterHandler = () => {
    if (this.currentEditor) this.currentEditor.fire("editorMouseEnter");
  };
  onMouseLeaveHandler = () => {
    if (this.currentEditor) this.currentEditor.fire("editorMouseLeave");
  };

  render() {
    const tableScale = this.props.width / this.props.tableWidth;

    let disableCover = null;

    if (this.props.viewOnly || !this.props.active) {
      disableCover = (
        <div
          onMouseEnter={this.onMouseEnterHandler}
          onMouseLeave={this.onMouseLeaveHandler}
          onClick={this.onMouseLeaveHandler}
          ref={this.coverRef}
          className="tinyMceCover"
        />
      );
      resizeCover = (
        <div
          onMouseEnter={this.onMouseEnterHandler}
          onMouseLeave={this.onMouseLeaveHandler}
          onClick={this.onMouseLeaveHandler}
          ref={this.coverRef}
          className="tinyMceCover"
        />
      );
    }
    return (
      <React.Fragment>
        {/* <IframeComm
          attributes={this.attributes}
          postMessageData={this.props.tableContent}
          handleReady={this.onReady}
          handleReceiveMessage={this.onReceiveMessage}
        /> */}
        <Editor
          initialValue={
            "<div class='tableContainer' style='transform:scale(" +
            tableScale +
            ");width:" +
            this.props.width +
            "px; height:0;" +
            "'>" +
            this.props.tableContent +
            "</div>" //key={uuidv4()}
          }
          ref={node => (this.tinyEditor = node)}
          init={{
            plugins: "table autoresize",
            toolbar: false,
            content_css: "http://localhost:8081/tinymce/resetTinyMceTable.css",
            menubar: false,
            resize: !this.props.viewOnly,
            object_resizing: !this.props.viewOnly,
            body_class: "TinymceContainer",
            init_instance_callback: this.initCallbackHandler
          }}
          onObjectResizeStart={this.onObjectResizeHandler}
          onObjectResized={this.onObjectResizedHandler}
          onChange={this.onChangeHandler}
          onKeyDown={this.onChangeHandler}
          id={"Tiny" + this.props.uuid}
          onClick={e => this.onClickHandler(e)}
        />
        {disableCover}
      </React.Fragment>
    );
  }
}

module.exports = Tinymce;
