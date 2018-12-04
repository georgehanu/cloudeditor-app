const React = require("react");
const { merge } = require("ramda");
const randomColor = require("randomcolor");
const { connect } = require("react-redux");
const { compose } = require("redux");

const TextBlock = require("../Text/Text");
const Border = require("./Border/Border");
const {
  addObjectIdToSelected,
  addObjectIdActionSelected,
  removeActionSelection,
  removeSelection
} = require("../../../../../stores/actions/project");
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

  onClickHandler = event => {
    if (!this.props.viewOnly && !this.props.active)
      this.props.onSetActiveBlockHandler(this.props.id);
  };
  onMouseDownHandler = event => {
    if (!this.props.viewOnly) {
      event.stopPropagation();
      this.props.onStartActionHandler(this.props.id);
    }
  };
  onMouseUpHandler = () => {
    if (!this.props.viewOnly) this.props.onStopActionHandler(this.props.id);
  };

  componentDidUpdate() {
    console.log("editableRef2", this.editable);
    if (this.editable) {
      this.editable.setFocus();
      this.editable.setCaret();
    }
  }
  componentDidMount() {
    console.log("editableRef1", this.editable);
  }

  renderText = props => {
    const textProps = {
      id: props.id,
      width: props.width,
      maxWidth: props.width,
      fontFamily: props.fontFamily,
      fontSize: props.fontSize * props.scale,
      textAlign: props.textAlign,
      underline: props.underline,
      bold: props.bold,
      italic: props.italic,
      type: props.type,
      value: props.value,
      onUpdateProps: props.onUpdateProps,
      onTextChange: props.onTextChange,
      editableRef: this.getEditableReference
    };
    return <TextBlock {...textProps} />;
  };

  render() {
    const {
      width,
      height,
      top,
      left,
      type,
      active,
      editable,
      viewOnly,
      ...otherProps
    } = this.props;
    const style = {
      width: width,
      height: height,
      left: left,
      top: top,
      backgroundColor: randomColor()
    };
    let element = null;

    const contentEditable = !(this.props.viewOnly || 0) && editable;

    switch (type) {
      case "textflow":
        const textProps = {
          id: this.props.id,
          width: width,
          maxWidth: width,
          fontFamily: this.props.fontFamily,
          fontSize: this.props.fontSize * this.props.scale,
          textAlign: this.props.textAlign,
          underline: this.props.underline,
          bold: this.props.bold,
          italic: this.props.italic,
          type: this.props.type,
          value: this.props.value,
          onUpdateProps: this.props.onUpdateProps,
          onTextChange: this.props.onTextChange,
          editableRef: this.getEditableReference,
          contentEditable
        };
        element = <TextBlock {...textProps} />;
        break;
      default:
        break;
    }

    let border = null;
    if (!viewOnly) border = <Border width={width} height={height} />;

    const blockClasses = [
      "pageBlock",
      type,
      active && !viewOnly ? "active" : "",
      editable ? "editable" : ""
    ].join(" ");

    return (
      <div
        className={blockClasses}
        style={style}
        ref={this.props.getReference}
        onClick={this.onClickHandler}
        onMouseDown={this.onMouseDownHandler}
        onMouseUp={this.onMouseUpHandler}
      >
        <div className={[this.props.orientation, "blockOrientation"].join(" ")}>
          {element}
        </div>
        {border}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSetActiveBlockHandler: payload =>
      dispatch(addObjectIdToSelected(payload)),
    onStartActionHandler: payload =>
      dispatch(addObjectIdActionSelected(payload)),
    onStopActionHandler: payload => dispatch(removeActionSelection(payload)),
    onRemoveActiveBlockHandler: payload => dispatch(removeSelection(payload))
  };
};

module.exports = compose(
  withDraggable,
  withResizable,
  withRotatable
)(
  connect(
    null,
    mapDispatchToProps
  )(ObjectBlock)
);
