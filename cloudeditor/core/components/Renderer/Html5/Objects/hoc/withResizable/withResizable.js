const React = require("react");
const PropTypes = require("prop-types");
const $ = require("jquery");

require("../../../../../../rewrites/rotatable");
require("../../../../../../rewrites/resizable");
const { handleResizable: handleUI, destroyUi } = require("./resizable");
const { addSnapElements, removeSnapClass } = require("../hocUtils/hocUtils");

const withResizable = WrappedComponent => {
  const WithResizable = class extends React.Component {
    constructor(props) {
      super(props);
      this.el = null;
    }
    changePropsOnDragHandler = (ui, resizing, undoRedo) => {
      const { zoomScale, id, offsetTop, offsetLeft, parent } = this.props;
      if (undoRedo) {
        this.props.onUpdatePropsHandler({
          id,
          props: {
            width: ui.size.width / zoomScale,
            height: ui.size.height / zoomScale,
            top:
              (ui.position.top - offsetTop - parent.innerPage.offset.top) /
              zoomScale,
            left:
              (ui.position.left - offsetLeft - parent.innerPage.offset.left) /
              zoomScale,
            resizing
          }
        });
      } else {
        this.props.onUpdateNoUndoRedoPropsHandler({
          id,
          props: {
            width: ui.size.width / zoomScale,
            height: ui.size.height / zoomScale,
            top:
              (ui.position.top - offsetTop - parent.innerPage.offset.top) /
              zoomScale,
            left:
              (ui.position.left - offsetLeft - parent.innerPage.offset.left) /
              zoomScale,
            resizing
          }
        });
      }
    };
    onResizeStartHandler = (event, ui) => {
      var resizable = $(event.target).data("ui-resizable");

      resizable.options.snapToleranceDynamic =
        this.props.snapTolerance * this.props.zoomScale;
      resizable.options.snapTolerance = 10;
      ui = addSnapElements(event, ui, resizable.coords, resizable);
      this.changePropsOnDragHandler(ui, 1);
    };
    onResizeHandler = (event, ui) => {
      var text = $(event.target).find(".text");
      var text = $(event.target).find(".text");
      if (text.length) {
        if (text.width() > $(event.target).width()) {
          ui.size.width = text.width();
        }
        if (text.height() > $(event.target).height()) {
          ui.size.height = text.height();
        }
      }
      var resizable = $(event.target).data("ui-resizable");
      ui = addSnapElements(event, ui, resizable.coords, resizable);

      this.changePropsOnDragHandler(ui, 1);
    };
    onResizeStopHandler = (event, ui) => {
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
        this.props.permissions.resizeBlocks &&
        this.props.resizable &&
        this.props.type !== "tinymceTable1";
      this.$el = $(this.el);
      handleUI(
        this.$el,
        this.enableUI,
        this.onResizeStartHandler,
        this.onResizeHandler,
        this.onResizeStopHandler
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

  WithResizable.defaultProps = {
    resizable: 1,
    active: 0,
    viewOnly: 0,
    getReference: () => false
  };

  WithResizable.propTypes = {
    resizable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    getReference: PropTypes.func
  };

  return React.forwardRef((props, ref) => {
    return <WithResizable {...props} forwardedRef={ref} />;
  });
};

module.exports = withResizable;
