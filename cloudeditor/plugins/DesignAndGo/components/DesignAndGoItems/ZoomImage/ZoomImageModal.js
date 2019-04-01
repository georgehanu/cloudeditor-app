const React = require("react");
const Backdrop = require("../UI/Backdrop");
const { getCanvasImage } = require("../../../../../core/utils/GlobalUtils");

class ZoomImageModal extends React.Component {
  state = {
    canvasImage: null
  };

  componentDidMount() {
    this.setState({ canvasImage: getCanvasImage() });
  }

  render() {
    const zoomCanvasCss = {
      backgroundImage: this.state.canvasImage
        ? "url(" + this.state.canvasImage + ")"
        : undefined
    };

    return (
      <React.Fragment>
        <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
        <div className="zoomModalContainer">
          <div className="zoomModalImageContainer">
            <div className="zoomModalCloseContainer">
              <a
                href="#"
                className="zoomModalClose CloseMenu"
                onClick={e => {
                  e.preventDefault();
                  this.props.modalClosed();
                }}
              />
            </div>
            <div className="zoomModalImageInner">
              <div className="zoomModalImage" style={zoomCanvasCss} />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

module.exports = ZoomImageModal;
