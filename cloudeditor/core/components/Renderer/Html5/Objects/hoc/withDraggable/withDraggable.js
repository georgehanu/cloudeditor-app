const React = require("react");
const PropTypes = require("prop-types");
const $ = require("jquery");

const { handleDraggable: handleUI, destroyUi } = require("./draggable");
const { addSnapElements, removeSnapClass } = require("../hocUtils/hocUtils");

const withDraggable = WrappedComponent => {
  const WithDraggable = class extends React.Component {
    constructor(props) {
      super(props);
      this.el = null;
      this.$el = null; //jquery Element
      this.enableUI = false;
    }
    changePropsOnDragHandler = (ui, dragging, undoRedo) => {
      const {
        offsetLeft,
        offsetTop,
        zoomScale,
        id,
        parent,
        width,
        mirrored
      } = this.props;

      let newProps = {
        top:
          (ui.position.top - offsetTop - parent.innerPage.offset.top) /
          zoomScale,
        left:
          (ui.position.left - offsetLeft - parent.innerPage.offset.left) /
          zoomScale,
        dragging
      };

      if (mirrored) {
        newProps["left"] =
          parent.width / zoomScale -
          newProps["left"] -
          width / zoomScale -
          (2 * parent.offsetLeft) / zoomScale;
        /*  offsetLeft +
            parent.innerPage.offset.left -
            ui.position.left -
            width) /
          zoomScale; */
      }
      if (undoRedo) {
        this.props.onUpdatePropsHandler({
          id,
          props: newProps
        });
      } else {
        this.props.onUpdateNoUndoRedoPropsHandler({
          id,
          props: newProps
        });
      }
    };
    onDragStartHandler = (event, ui) => {
      this.changePropsOnDragHandler(ui, 1, 0);
      const draggable = $(event.target).data("ui-draggable");
      draggable.options.snapToleranceDynamic =
        this.props.snapTolerance * this.props.zoomScale;
      draggable.options.snapTolerance = 10;
      ui = addSnapElements(event, ui, draggable.snapElements, draggable);
    };
    onDragHandler = (event, ui) => {
      const draggable = $(event.target).data("ui-draggable");
      ui = addSnapElements(event, ui, draggable.snapElements, draggable);
      // this.changePropsOnDragHandler(ui, 1, 0);
    };
    onDragStopHandler = (event, ui) => {
      this.changePropsOnDragHandler(ui, 0, 1);
      removeSnapClass();
    };

    componentDidMount() {
      this.updateUI();
    }

    componentDidUpdate() {
      this.updateUI();
    }
    componentWillUnmount() {
      destroyUi(this.$el);
    }

    updateUI = () => {
      this.enableUI =
        !this.props.active &&
        !this.props.viewOnly &&
        (this.props.movable || this.props.backendEditor) &&
        this.props.permissions.moveBlocks;
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
