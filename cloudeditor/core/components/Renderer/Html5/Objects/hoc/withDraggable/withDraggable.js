const React = require("react");
const PropTypes = require("prop-types");
const $ = require("jquery");

const handleUI = require("./draggable");

const withDraggable = WrappedComponent => {
  const WithDraggable = class extends React.Component {
    constructor(props) {
      super(props);
      this.el = null;
      this.$el = null; //jquery Element
      this.enableUI = false;
    }

    onDragStartHandler = (event, ui) => {};
    onDragHandler = (event, ui) => {};
    onDragStopHandler = (event, ui) => {};

    componentDidMount() {
      this.updateUI();
    }

    componentDidUpdate() {
      this.updateUI();
    }

    updateUI = () => {
      this.enableUI =
        !this.props.active && !this.props.viewOnly && this.props.movable;
      this.$el = $(this.el);
      handleUI(
        this.$el,
        this.enableUI,
        this.onDragStartHandler,
        this.onDragHandler,
        this.onDragStopHandler
      );
    };

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

  WithDraggable.propTypes = {
    movable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    getReference: PropTypes.func
  };

  WithDraggable.defaultProps = {
    movable: 0,
    active: 0,
    viewOnly: 0,
    getReference: () => false
  };

  return React.forwardRef((props, ref) => {
    return <WithDraggable {...props} forwardedRef={ref} />;
  });
};

module.exports = withDraggable;
