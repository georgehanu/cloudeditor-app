const React = require("react");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const PropTypes = require("prop-types");
const randomColor = require("randomcolor");

const Page = require("../Page/Page");

class Canvas extends React.Component {
  render() {
    const style = {
      ...this.props.propStyle
    };
    const { getContainerRef, pageReady, ...otherProps } = this.props;

    let pageContainer = null;
    if (pageReady) {
      pageContainer = <Page {...this.props} />;
    }

    return (
      <div style={style} className="canvasContainer" ref={getContainerRef}>
        {pageContainer}
      </div>
    );
  }
}
Canvas.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  getContainerRef: PropTypes.func,
  activePage: PropTypes.object,
  scale: PropTypes.number,
  pageReady: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

Canvas.defaultProps = {
  viewOnly: 0,
  getContainerRef: () => {},
  activePage: {},
  scale: 1,
  pageReady: false
};

const CanvasComponent = hot(module)(connect(null)(Canvas));
module.exports = CanvasComponent;
