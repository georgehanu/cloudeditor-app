const React = require("react");
const PropTypes = require("prop-types");

require("./Snap.css");
const Line = require("../../../Boxes/Line");

const withSnap = WrappedComponent => {
  const WithSnap = class extends React.Component {
    getReference = ref => {
      this.el = ref;
      this.props.getReference(ref);
    };

    render() {
      const {
        left,
        top,
        offsetLeft,
        offsetTop,
        width,
        height,
        resizing,
        dragging,
        rotating
      } = this.props;
      let lines = null;
      const { forwardedRef, getReference, ...rest } = this.props;
      if (!(rotating || dragging || resizing)) {
        const topSnap = {
          top: top + offsetTop,
          width: "100%",
          height: 1,
          left: 0
        };
        const rightSnap = {
          top: 0,
          width: 1,
          height: "100%",
          left: left + width + offsetLeft
        };
        const bottomSnap = {
          top: top + height + offsetTop,
          width: "100%",
          height: 1,
          left: 0
        };
        const leftSnap = {
          top: 0,
          width: 1,
          height: "100%",
          left: left + offsetLeft
        };
        const classes = ["snapLine", "boxLine", "drag_alignLines"].join(" ");
        lines = (
          <React.Fragment>
            <Line classes={classes} {...topSnap} />
            <Line classes={classes} {...rightSnap} />
            <Line classes={classes} {...bottomSnap} />
            <Line classes={classes} {...leftSnap} />
          </React.Fragment>
        );
      }
      return (
        <React.Fragment>
          <WrappedComponent
            ref={this.forwardedRef}
            getReference={this.getReference}
            {...rest}
          />
          {lines}
        </React.Fragment>
      );
    }
  };

  WithSnap.propTypes = {
    snap: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    getReference: PropTypes.func
  };

  WithSnap.defaultProps = {
    snap: 0,
    active: 0,
    viewOnly: 0,
    getReference: () => false
  };

  return React.forwardRef((props, ref) => {
    return <WithSnap {...props} forwardedRef={ref} />;
  });
};

module.exports = withSnap;
