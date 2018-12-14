const React = require("react");
const TinyMCE = require("react-tinymce");
const withDraggable = require("../hoc/withDraggable/withDraggable");
const withResizable = require("../hoc/withResizable/withResizable");
const withRotatable = require("../hoc/withRotatable/withRotatable");
const { compose } = require("redux");
require("./Tinymce.css");

class Tinymce extends React.Component {
  render() {
    const height = this.props.height;
    return (
      <TinyMCE
        content={this.props.tableContent}
        config={{
          plugins: "table",
          toolbar: "table",
          menubar: false,
          //autoresize_max_height: 500,
          height: height,
          //theme_advanced_buttons3_add: "row_props",
          //menubar: "table",
          //content_css: 'css',
          body_class: "TinymceContainer"
        }}
        //onChange={this.props.handleEditorChange}
      />
    );
  }
}

module.exports = compose(
  withDraggable,
  withResizable,
  withRotatable
)(Tinymce);
