const React = require("react");
const PropTypes = require("prop-types");

require("../../../../../../rewrites/rotatable");

const withRotatable = WrappedComponent => {
  const WithRotatable = class extends React.Component {
    constructor(props) {
      super(props);
      this.el = null;
    }

    componentDidMount() {
      console.log("isRotatable", this.props.isRotatable);
      console.log("innerRef rotatable", this.el);
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

  WithRotatable.propTypes = {
    rotatable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    getReference: PropTypes.func
  };

  WithRotatable.defaultProps = {
    rotatable: 1,
    getReference: () => false
  };

  return React.forwardRef((props, ref) => {
    return <WithRotatable {...props} forwardedRef={ref} />;
  });
};

module.exports = withRotatable;
