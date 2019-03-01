const React = require("react");
const PropTypes = require("prop-types");
const ContentEditable = require("../ContentEditable/ContentEditable");
const { connect } = require("react-redux");
const { hot } = require("react-hot-loader");
const {
  fontMetricsSelector
} = require("../../../../../../core/stores/selectors/ui");

require("./Text.css");

class TextBlock extends React.Component {
  constructor(props) {
    super(props);
    this.editableContainerRef = null;
  }

  handleChange = (ev, value) => {
    this.checkDimm();
    this.props.onUpdateProps({
      id: this.props.id,
      props: {
        value: value
      }
    });
  };

  getInputRef = ref => {
    this.editableContainerRef = ref;
  };
  componentDidMount() {
    const result = this.getLineHeight();
    const editableContainerRef = this.editableContainerRef;
    if (editableContainerRef) {
      editableContainerRef.style.lineHeight = result.editorLineHeight + "px";
      this.props.onUpdateProps({
        id: this.props.id,
        props: {
          lineHeight: result.pdfLibLineHeight / this.props.zoomScale
        }
      });
      //const top = this.getFontForge();
      //editableContainerRef.style.top = top + "px";
    }
  }
  componentDidUpdate() {
    this.checkDimm();
    const result = this.getLineHeight();
    const editableContainerRef = this.editableContainerRef;
    if (editableContainerRef) {
      editableContainerRef.style.lineHeight = result.editorLineHeight + "px";
      this.props.onUpdateProps({
        id: this.props.id,
        props: {
          lineHeight: result.pdfLibLineHeight / this.props.zoomScale
        }
      });
      //const top = this.getFontForge();
      //editableContainerRef.style.top = top + "px";
    }
  }

  checkDimm = () => {
    const containerEditable = this.editableContainerRef;
    if (containerEditable) {
      const height = this.props.height;
      const width = this.props.width;
      let workingWidth = containerEditable.offsetWidth;
      let workingHeight = containerEditable.offsetHeight;
      if (height < workingHeight) {
        workingWidth = containerEditable.offsetWidth / this.props.zoomScale;
        workingHeight = containerEditable.offsetHeight / this.props.zoomScale;
        this.props.onUpdateProps({
          id: this.props.id,
          props: {
            height: workingHeight
          }
        });
      }
      if (width < workingWidth) {
        workingWidth = containerEditable.offsetWidth / this.props.zoomScale;
        this.props.onUpdateProps({
          id: this.props.id,
          props: {
            width: workingWidth
          }
        });
      }
    }
  };
  getLineHeight = () => {
    const { lineheightn, lineheightp, fontSize } = this.props;
    lh = 100;
    if (typeof lineheightp != "undefined" && lineheightp) {
      lh = lineheightp;
    } else {
      if (typeof lineheightn != "undefined" && lineheightp) lh = lineheightn;
    }
    var d = fontSize * (lh / 100);
    if (d % 1 > 0.5) {
      if (d == 0) {
        var lh1 = 0;
      } else {
        var lh1 = ((fontSize * Math.ceil(d)) / d) * (lh / 100);
      }
      lineHeightEditor = Math.ceil(d);
      lineHeightPdf = lh1.toFixed(2);
    } else {
      if (d == 0) {
        var lh1 = 0;
      } else {
        var lh1 = ((fontSize * Math.floor(d)) / d) * (lh / 100);
      }
      lineHeightEditor = Math.floor(d);
      lineHeightPdf = lh1.toFixed(2);
    }

    return {
      editorLineHeight: lineHeightEditor,
      pdfLibLineHeight: lineHeightPdf
    };
  };
  getFontForge = () => {
    let top = 0;
    let lineHeight = 1;
    const {
      lineheightn,
      lineheightp,
      vAlign,
      fontFamily,
      fontMetrics
    } = this.props;
    let { fontSize } = this.props;
    // fontSize = fontSize / this.props.fontSize;

    const editableContainerRef = this.editableContainerRef;
    if (!editableContainerRef) return top;

    if (typeof lineheightp != "undefined" && lineheightp) {
      lineHeight = lineheightp / 100;
    } else {
      if (typeof lineheightn != "undefined" && lineheightn)
        lineHeight = lineheightn / 100;
    }

    if (typeof fontMetrics[fontFamily] === "undefined") return top;

    const configFont = fontMetrics[fontFamily];
    const tpa = ((parseFloat(configFont.ir) / 2) * fontSize) / 100;
    const tpa3 = (fontSize * lineHeight - fontSize) / 2;
    const diff = 0;
    switch (vAlign) {
      case "top":
        var maxAscent = Math.max(
          parseFloat(configFont.hhascent),
          parseFloat(configFont.winascent)
        );
        var tpa1 =
          (((maxAscent - parseFloat(configFont.typoascent)) /
            parseFloat(configFont.emsize)) *
            100 *
            fontSize) /
          100;
        top = tpa - tpa1 - tpa3;
        break;
      case "middle":
        var maxAscent = Math.max(
          parseFloat(configFont.hhascent),
          parseFloat(configFont.winascent)
        );
        var tpaTop =
          (((maxAscent - parseFloat(configFont.typoascent)) /
            parseFloat(configFont.emsize)) *
            100 *
            fontSize) /
          100;
        var maxDescent = Math.max(
          parseFloat(configFont.hhdescent),
          parseFloat(configFont.windescent)
        );
        var tpaBottom =
          ((maxDescent / parseFloat(configFont.emsize)) * 100 * fontSize) / 100;
        var top1 = tpa - tpaTop - tpa3;
        var top2 = tpa - tpaBottom - tpa3;

        top = (top1 - top2) / 2;
        if (diff > 0) top -= diff / 2;
        break;
      case "bottom":
        var maxDescent = Math.max(
          parseFloat(configFont.hhdescent),
          parseFloat(configFont.windescent)
        );
        var tpa1 =
          ((maxDescent / parseFloat(configFont.emsize)) * 100 * fontSize) / 100;
        top = -1 * (tpa - tpa1 - tpa3);
        if (diff > 0) top -= diff;
        break;
      default:
        break;
    }

    return top * this.props.zoomScale;
  };
  render() {
    const { width } = this.props;
    const vAlign = {
      top: "normal",
      middle: "center",
      bottom: "flex-end"
    };
    const style = {
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
          content={
            !this.props.value.length && !this.props.active
              ? this.props.placeHolder
              : this.props.value
          }
          active={this.props.active}
          id={this.props.renderId}
          tagName="div"
          sanitise={true}
          multiLine={true}
          onChange={this.handleChange}
          onKeyPress={this.onKeyDownHandler}
          onBlur={this.sanitize}
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
  fillColor: "#000",
  lineHeight: "1"
};
const mapStateToProps = (state, _) => {
  return {
    fontMetrics: fontMetricsSelector(state)
  };
};

module.exports = hot(module)(
  connect(
    mapStateToProps,
    null
  )(TextBlock)
);
