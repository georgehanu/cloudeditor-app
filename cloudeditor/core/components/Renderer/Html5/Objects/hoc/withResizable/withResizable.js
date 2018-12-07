const React = require("react");
const PropTypes = require("prop-types");
const $ = require("jquery");

require("../../../../../../rewrites/rotatable");
require("../../../../../../rewrites/resizable");
const handleUI = require("./resizable");
const { addSnapElements, removeSnapClass } = require("../hocUtils/hocUtils");

const withResizable = WrappedComponent => {
  const WithResizable = class extends React.Component {
    constructor(props) {
      super(props);
      this.el = null;
    }
    changePropsOnDragHandler = (ui, resizing) => {
      const { zoomScale, id, offsetTop, offsetLeft } = this.props;
      this.props.onUpdatePropsHandler({
        id,
        props: {
          width: ui.size.width / zoomScale,
          height: ui.size.height / zoomScale,
          top: (ui.position.top - offsetTop) / zoomScale,
          left: (ui.position.left - offsetLeft) / zoomScale,
          resizing
        }
      });
    };
    onResizeStartHandler = (event, ui) => {
      var resizable = $(event.target).data("ui-resizable");
      ui = addSnapElements(event, ui, resizable.coords, resizable);
    };
    onResizeHandler = (event, ui) => {
      var resizable = $(event.target).data("ui-resizable");
      ui = addSnapElements(event, ui, resizable.coords, resizable);
      this.changePropsOnDragHandler(ui, 1);
    };
    onResizeStopHandler = (event, ui) => {
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
        !this.props.active && !this.props.viewOnly && this.props.resizable;
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
