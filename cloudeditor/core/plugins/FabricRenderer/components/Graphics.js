const { fabric } = require("../../../rewrites/fabric/fabric");
const { graphicsTypes, graphicsDefaults } = require("./types/graphics");
const FabricObject = require("./fabricObject");

class Graphics extends FabricObject {
  constructor(props) {
    super(props);
    this.setPropsToSkip({
      _objects: true,
      loadedInstance: true
    });
    this.instance = new fabric.Graphics([props.loadedInstance]);

    this.props.isLoaded = 1;
    this._applyProps(this.props);
  }
  _updatePicture() {
    const drawingNode = this.instance.canvas;
    if (this.instance.getObjects().length) {
      let childGraphics = this.instance.getObjects()[0];
      if (
        childGraphics.getScaledWidth() / this.instance.width <
        childGraphics.getScaledHeight() / this.instance.height
      ) {
        childGraphics.scaleToHeight(this.instance.height);
      } else {
        childGraphics.scaleToWidth(this.instance.width);
      }
      childGraphics.set(
        "left",
        -this.instance.getScaledWidth() / 2 +
          (this.instance.getScaledWidth() - childGraphics.getScaledWidth()) / 2
      );
      childGraphics.set(
        "top",
        -this.instance.getScaledHeight() / 2 +
          (this.instance.getScaledHeight() - childGraphics.getScaledHeight()) /
            2
      );
    }

    if (drawingNode) return drawingNode.requestRenderAll();
  }
}

Graphics.propTypes = graphicsTypes;

Graphics.defaultProps = graphicsDefaults;

module.exports = Graphics;
