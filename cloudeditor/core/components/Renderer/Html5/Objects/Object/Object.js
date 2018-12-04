const React = require("react");
const PropTypes = require("prop-types");
const randomColor = require("randomcolor");
const { connect } = require("react-redux");
const { compose } = require("redux");

const withDraggable = require("../hoc/withDraggable/withDraggable");
const withResizable = require("../hoc/withResizable/withResizable");
const withRotatable = require("../hoc/withRotatable/withRotatable");
require("./Object.css");

class ObjectBlock extends React.Component {
  constructor(props) {
    super(props);
    this.editable = null;
  }

  getEditableReference = ref => {
    this.editable = ref;
  };
  render() {
    const {
      width,
      height,
      top,
      left,
      active,
      viewOnly,
      editable,
      type
    } = this.props;

    const classes = [
      "pageBlock",
      type,
      active && !viewOnly ? "active" : "",
      editable ? "editable" : ""
    ].join(" ");

    const style = {
      width: width,
      height: height,
      left: left,
      top: top,
      backgroundColor: randomColor()
    };
    return (
      <div className={classes} style={style} ref={this.props.getReference}>
        test
      </div>
    );
  }
}

ObjectBlock.propTypes = {
  viewOnly: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  active: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  editable: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

ObjectBlock.defaultProps = {
  viewOnly: 0,
  active: 0,
  editable: 1
};

module.exports = compose(
  withDraggable,
  withResizable,
  withRotatable
)(
  connect(
    null,
    null
  )(ObjectBlock)
);
