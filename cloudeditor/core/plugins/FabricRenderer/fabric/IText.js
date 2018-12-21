const { fabric } = require("../../../rewrites/fabric/fabric");
const { ITextTypes, ITextDefaults } = require("./types/itext");

const Text = require("./Text");

class IText extends Text {
  _initInstance() {
    this.instance = new fabric.IText(this.props.text, this.props);
    this._applyProps(this.props);
  }
}

IText.propTypes = ITextTypes;
IText.defaultProps = ITextDefaults;

module.exports = IText;
