const React = require("react");
const PropTypes = require("prop-types");

require("../../../../../../rewrites/rotatable");
require("../../../../../../rewrites/resizable");

const withResizable = WrappedComponent => {
  const WithResizable = class extends React.Component {
    constructor(props) {
      super(props);
      this.el = null;
    }

    componentDidMount() {
      console.log("isResizable", this.props.isResizable);
      console.log("innerRef resizable", this.el);
    }

    getReference = ref => {
      this.el = ref;
      this.props.getReference(ref);
    };

    render() {
      const { forwardedRef, getReference, ...rest } = this.props;
      return (
        <WrappedComponent
          ref={this.forwardedRef}
          getReference={this.getReference}
          {...rest}
        />
      );
    }
  };

  WithResizable.propTypes = {
    resizable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    getReference: PropTypes.func
  };

  WithResizable.defaultProps = {
    resizable: 1,
    getReference: () => false
  };

  return React.forwardRef((props, ref) => {
    return <WithResizable {...props} forwardedRef={ref} />;
  });
};

module.exports = withResizable;
