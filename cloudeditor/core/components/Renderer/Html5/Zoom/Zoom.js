const React = require("react");
const PropTypes = require("prop-types");

require("./Zoom.css");
const Page = require("../Page/Page");

class Zoom extends React.Component {
  render() {
    const { getContainerRef, pageReady, zoom } = this.props;
    const classes = ["zoomContainer", zoom > 1 ? "zoomActive" : ""].join(" ");
    let pageContainer = null;
    if (pageReady) {
      pageContainer = <Page {...this.props} />;
    }
    return (
      <div className={classes} ref={getContainerRef}>
        {pageContainer}
      </div>
    );
  }
}
Zoom.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

Zoom.defaultProps = {
  viewOnly: 0
};

module.exports = Zoom;
