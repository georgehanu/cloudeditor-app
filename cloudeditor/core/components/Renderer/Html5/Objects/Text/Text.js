const React = require("react");
const randomColor = require("randomcolor");
const PropTypes = require("prop-types");
const ContentEditable = require("../ContentEditable/ContentEditable");

class TextBlock extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  handleChange = (ev, value) => {
    this.props.onTextChange({
      id: this.props.id,
      props: {
        value: value
      }
    });

    this.props.onUpdateProps({
      id: this.props.id,
      props: {
        value: value
      }
    });
  };

  componentDidMount() {}

  render() {
    const { width, ...otherProps } = this.props;
    const style = {
      width: width,
      maxWidth: width,
      fontFamily: this.props.fontFamily,
      fontSize: this.props.fontSize,
      textAlign: this.props.textAlign,
      textDecoration: this.props.underline ? "underline" : "none",
      fontWeight: this.props.bold ? "bold" : "normal",
      fontStyle: this.props.italic ? "italic" : "normal",
      backgroundColor: randomColor()
    };

    let content = <div>{this.props.value}</div>;

    if (this.props.contentEditable) {
      content = (
        <ContentEditable
          ref={ref => this.props.editableRef(ref)}
          className={this.props.type}
          content={this.props.value}
          tagName="div"
          sanitise={true}
          multiLine={true}
          onChange={this.handleChange}
        />
      );
    }

    return <div style={style}>{content}</div>;
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
  letterSpacing: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
  letterSpacing: "normal"
};

module.exports = TextBlock;
