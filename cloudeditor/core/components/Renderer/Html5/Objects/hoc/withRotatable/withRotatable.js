const React = require("react");
const PropTypes = require("prop-types");
const $ = require("jquery");
const { handleRotatable: handleUI, destroyUi } = require("./rotatable");
require("../../../../../../rewrites/rotatable");

const withRotatable = WrappedComponent => {
  const WithRotatable = class extends React.Component {
    constructor(props) {
      super(props);
      this.el = null;
    }

    changePropsOnDragHandler = (ui, rotating) => {
      const { id } = this.props;
      const angle = ((ui.angle.current * 180) / Math.PI) % 360;
      this.props.onUpdatePropsHandler({ id, props: { angle, rotating } });
    };
    onRotateStartHandler = (event, ui) => {};
    onRotateHandler = (event, ui) => {
      this.changePropsOnDragHandler(ui, 0);
    };
    onRotateStopHandler = (event, ui) => {
      this.changePropsOnDragHandler(ui, 0);
    };
    componentDidMount() {
      this.updateUI();
    }

    componentDidUpdate() {
      this.updateUI();
    }
    updateUI = () => {
      this.enableUI =
        !this.props.active && !this.props.viewOnly && this.props.rotatable;
      this.$el = $(this.el);
      const radians = (this.props.angle * Math.PI) / 180;
      handleUI(
        this.$el,
        this.enableUI,
        this.onRotateStartHandler,
        this.onRotateHandler,
        this.onRotateStopHandler,
        radians
      );
    };
    getReference = ref => {
      this.el = ref;
      this.props.getReference(ref);
    };
    componentWillUnmount() {
      destroyUi(this.$el);
    }
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
    viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
    getReference: PropTypes.func
  };

  WithRotatable.defaultProps = {
    rotatable: 1,
    active: 0,
    viewOnly: 0,
    getReference: () => false
  };

  return React.forwardRef((props, ref) => {
    return <WithRotatable {...props} forwardedRef={ref} />;
  });
};

module.exports = withRotatable;
