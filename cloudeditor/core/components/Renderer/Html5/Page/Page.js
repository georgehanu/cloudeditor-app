const React = require("react");
const ObjectBlock = require("../Objects/Object/Object");

require("./Page.css");

class Page extends React.Component {
  constructor(props) {
    super(props);
    this.pageContainerRef = React.createRef();
  }

  renderObjects() {
    const { objects, viewOnly } = this.props;
    console.log("objects", objects);
    return Object.keys(objects).map(obKey => {
      return (
        <ObjectBlock key={obKey} {...objects[obKey]} viewOnly={viewOnly} />
      );
    });
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
        {/* {this.renderObjects()} */}
      </div>
    );
  }
}

module.exports = Page;
