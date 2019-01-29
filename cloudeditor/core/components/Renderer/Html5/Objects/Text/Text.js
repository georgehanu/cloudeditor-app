const React = require("react");
const PropTypes = require("prop-types");
const ContentEditable = require("../ContentEditable/ContentEditable");

require("./Text.css");

class TextBlock extends React.Component {
  constructor(props) {
    super(props);
    this.editableContainerRef = null;
  }
  handleChange = (ev, value) => {
    const containerEditable = this.editableContainerRef;
    let height = this.props.height;
    if (height < containerEditable.offsetHeight) {
      height = containerEditable.offsetHeight / this.props.zoomScale;
      this.props.onUpdateProps({
        id: this.props.id,
        props: {
          value: value,
          height
        }
      });
    } else {
      this.props.onUpdateProps({
        id: this.props.id,
        props: {
          value: value
        }
      });
    }
  };

  getInputRef = ref => {
    this.editableContainerRef = ref;
  };
  componentDidMount() {}

  render() {
    const { width } = this.props;
    const vAlign = {
      top: "normal",
      middle: "center",
      bottom: "flex-end"
    };
    const style = {
      width: width,
      maxWidth: width,
      fontFamily: this.props.fontFamily,
      color: "rgb(" + this.props.fillColor + ")",
      fontSize: this.props.fontSize,
      textAlign: this.props.textAlign,
      textDecoration: this.props.underline ? "underline" : "none",
      fontWeight: this.props.bold ? "bold" : "normal",
      fontStyle: this.props.italic ? "italic" : "normal",
      justifyContent: vAlign[this.props.vAlign]
    };

    let content = <div>{this.props.value}</div>;

    if (this.props.contentEditable) {
      content = (
        <ContentEditable
          innerRef={this.getInputRef}
          className={this.props.type}
          content={this.props.value}
          active={this.props.active}
          id={this.props.renderId}
          tagName="div"
          sanitise={true}
          multiLine={true}
          onChange={this.handleChange}
        />
      );
    }

    return (
      <div className="blockData" style={style}>
        {content}
      </div>
    );
  }
}

TextBlock.propTypes = {
  width: PropTypes.number,
  fontFamily: PropTypes.string,
  vAlign: PropTypes.oneOf(["top", "middle", "bottom"]),
  textAlign: PropTypes.oneOf(["left", "center", "justify", "right"]),
  underline: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  bold: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  italic: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  lineHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wordSpacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  letterSpacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fillColor: PropTypes.string
};

TextBlock.defaultProps = {
  width: 0,
  fontFamily: "Arial",
  vAlign: "top",
  textAlign: "left",
  underline: 0,
  bold: 0,
  italic: 0,
  lineHeight: "normal",
  wordSpacing: "normal",
  letterSpacing: "normal",
  fillColor: "#000"
};

module.exports = TextBlock;
