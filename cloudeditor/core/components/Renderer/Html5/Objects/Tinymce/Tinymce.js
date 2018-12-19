const React = require("react");
const TinyMCE = require("react-tinymce");
const withDraggable = require("../hoc/withDraggable/withDraggable");
const withResizable = require("../hoc/withResizable/withResizable");
const withRotatable = require("../hoc/withRotatable/withRotatable");
const { compose } = require("redux");
require("./Tinymce.css");
const uuidv4 = require("uuid/v4");
const { updateObjectProps } = require("../../../../../stores/actions/project");
const { connect } = require("react-redux");

class Tinymce extends React.Component {
  onChangeHandler = event => {
    console.log("changed");
  };

  onClickHandler = event => {
    const fontSize = (
      parseFloat(event.target.style.fontSize.replace("pt", "")) /
      this.props.zoomScale
    ).toFixed(2);

    this.props.updateObjectProps({
      id: this.props.id,
      props: {
        bold: event.target.style.fontWeight === "bold" ? true : false,
        italic: event.target.style.fontStyle === "italic" ? true : false,
        underline:
          event.target.style.textDecoration === "italic" ? true : false,
        textAlign: event.target.style.textAlign,
        fontSize,
        fontFamily: event.target.style.fontFamily,
        toolbarUpdate: false
      }
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.toolbarUpdate === true) {
      const editableArea = tinyMCE
        .get("Tiny" + nextProps.id)
        .selection.getNode();

      editableArea.style.fontWeight = nextProps.bold ? "bold" : "normal";
      editableArea.style.fontStyle = nextProps.italic ? "italic" : "normal";
      editableArea.style.textDecoration = nextProps.underline
        ? "underline"
        : "";
      editableArea.style.textAlign = nextProps.textAlign;
      editableArea.style.fontSize = nextProps.fontSize + "pt";
      editableArea.style.fontFamily = nextProps.fontFamily;
    }

    return prevState;
  }

  render() {
    return (
      <TinyMCE
        //key={uuidv4()}
        content={this.props.tableContent}
        config={{
          plugins: "table autoresize",
          toolbar: "table",
          menubar: false,
          //autoresize_max_height: 500,
          height: this.props.height,
          width: this.props.width,
          //theme_advanced_buttons3_add: "row_props",
          //menubar: "table",
          //content_css: 'css',
          body_class: "TinymceContainer"
          //selector: "textarea.editor"
        }}
        onChange={this.onChangeHandler}
        onClick={this.onClickHandler}
        id={"Tiny" + this.props.id}
      />
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateObjectProps: payload => {
      dispatch(updateObjectProps(payload));
    }
  };
};

module.exports = compose(
  withDraggable,
  withResizable,
  withRotatable
)(
  connect(
    null,
    mapDispatchToProps
  )(Tinymce)
);
