const React = require("react");
const TinyMCE = require("react-tinymce");
const withDraggable = require("../hoc/withDraggable/withDraggable");
const withResizable = require("../hoc/withResizable/withResizable");
const withRotatable = require("../hoc/withRotatable/withRotatable");
const { compose } = require("redux");
require("./Tinymce.css");
const uuidv4 = require("uuid/v4");

class Tinymce extends React.Component {
  state = {
    activeEditor: null
  };
  onChangeHandler = event => {
    console.log("changed");
  };

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
          body_class: "TinymceContainer",
          //selector: "textarea.editor"
          init_instance_callback: function(editor) {
            //console.log("init");
            //editor.execCommand("mceAutoResize");
          }
        }}
        init={{
          setup: editor => {
            this.setState({ activeEditor: editor });
          }
        }}
        onChange={this.onChangeHandler}
      />
    );
  }
}

module.exports = compose(
  withDraggable,
  withResizable,
  withRotatable
)(Tinymce);
