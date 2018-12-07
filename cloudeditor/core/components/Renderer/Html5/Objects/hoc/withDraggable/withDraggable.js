const React = require("react");
const PropTypes = require("prop-types");
const $ = require("jquery");

const handleUI = require("./draggable");
const { addSnapElements, removeSnapClass } = require("../hocUtils/hocUtils");

const withDraggable = WrappedComponent => {
  const WithDraggable = class extends React.Component {
    constructor(props) {
      super(props);
      this.el = null;
      this.$el = null; //jquery Element
      this.enableUI = false;
    }
    changePropsOnDragHandler = (ui, dragging) => {
      const { offsetLeft, offsetTop, zoomScale, id } = this.props;
      this.props.onUpdatePropsHandler({
        id,
        props: {
          top: (ui.position.top - offsetTop) / zoomScale,
          left: (ui.position.left - offsetLeft) / zoomScale,
          dragging
        }
      });
    };
    onDragStartHandler = (event, ui) => {
      const draggable = $(event.target).data("ui-draggable");
      ui = addSnapElements(event, ui, draggable.snapElements, draggable);
    };
    onDragHandler = (event, ui) => {
      const draggable = $(event.target).data("ui-draggable");
      ui = addSnapElements(event, ui, draggable.snapElements, draggable);
      this.changePropsOnDragHandler(ui, 1);
    };
    onDragStopHandler = (event, ui) => {
      this.changePropsOnDragHandler(ui, 0);
      removeSnapClass();
    };

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
          handleDraggableUi={handleUI}
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
