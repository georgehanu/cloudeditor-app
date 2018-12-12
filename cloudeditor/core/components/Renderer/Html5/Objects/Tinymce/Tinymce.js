const React = require("react");
const TinyMCE = require("react-tinymce");
const withDraggable = require("../hoc/withDraggable/withDraggable");
const withResizable = require("../hoc/withResizable/withResizable");
const withRotatable = require("../hoc/withRotatable/withRotatable");
const { compose } = require("redux");

class Tinymce extends React.Component {
  state = {
    tableContent:
      "<table><tr style='display:none'><td>NAME</td><td>AGE</td></tr><tr><td>A</td><td>B</td></tr><tr><td>C</td><td>D</td></tr></tbody></table>"
  };
  render() {
    return (
      <TinyMCE
        //content={this.props.tableContent}
        content={this.state.tableContent}
        config={{
          plugins: "table",
          toolbar: "table",
          menubar: false,
          autoresize_max_height: 500,
          height: 200,
          custom_buttons3: "row_props"
          //theme_advanced_buttons3_add: "row_props",
          //menubar: "table",
          //content_css: 'css',
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
