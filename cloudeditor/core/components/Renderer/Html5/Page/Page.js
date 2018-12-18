const React = require("react");

const Objects = require("../Objects/Objects");

require("./Page.css");

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.pageContainerRef = React.createRef();
  }

  render() {
    const { width, height, marginTop, marginLeft } = this.props;
    const pageStyle = {
      width,
      height,
      marginLeft,
      marginTop
    };
    return (
      <div
        ref={this.props.getPageRef}
        style={pageStyle}
        className="pageContainer page"
      >
        <Objects />
      </div>
    );
  }
}

module.exports = Page;
