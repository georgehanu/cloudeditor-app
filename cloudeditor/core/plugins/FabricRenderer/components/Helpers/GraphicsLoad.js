const React = require("react");
const { forEach } = require("ramda");
const { fabric } = require("../../../../rewrites/fabric/fabric");
const { Graphics } = require("../index");
class GraphicsLoad extends React.Component {
  constructor(...args) {
    super(...args);
    this.state = {
      instance: null,
      error: false,
      loaded: false
    };
  }

  loadShape(src) {
    if (!src) {
      throw new Error("Expected svg src instead saw " + typeof src);
    }
    fabric.loadSVGFromURL(src, (objects, options) => {
      let scale = Math.min(
        this.props.width / options.width,
        this.props.height / options.height
      );

      forEach(obj => {
        obj.isLoaded = 1;
      }, objects);
      let loadedObject = fabric.util.groupGraphicsSVGElements(objects, options);
      loadedObject.isLoaded = 1;
      if (
        this.props.width / loadedObject.width >
        this.props.height / loadedObject.height
      ) {
        loadedObject.scaleToHeight(this.props.height);
      } else {
        loadedObject.scaleToWidth(this.props.width);
      }

      //  loadedObject.scaleToHeight(this.props.height);
      this.setState({ loaded: true, instance: loadedObject });
    });
  }
  componentDidMount = () => {
    this.loadShape(this.props.src);
  };

  render() {
    let render = null;
    if (this.state.loaded)
      render = (
        <Graphics loadedInstance={this.state.instance} {...this.props} />
      );
    return render;
  }
}
module.exports = GraphicsLoad;
