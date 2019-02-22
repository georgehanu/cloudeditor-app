const React = require("react");
require("./Tinymce.css");

class TinymcePagination extends React.Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      nextProps.tableContent === this.props.tableContent &&
      nextProps.width === this.props.width &&
      nextProps.height === this.props.height
    ) {
      return false;
    }

    return true;
  };
  render() {
    const { width, height, tableContent, zoomScale } = this.props;
    if (width === 0) {
      return null;
    }

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
}

module.exports = TinymcePagination;
