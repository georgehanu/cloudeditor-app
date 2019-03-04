const React = require("react");
const UploadImage = require("../../LayoutItems/UploadImage");

const WithSliderDim = require("../renderProps/withSliderDim");
const ItemLabel = require("./ItemLabel");
const isEqual = require("react-fast-compare");

require("./sliderItem.css");

class SliderItem extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (isEqual(this.props, nextProps)) {
      return false;
    }
    return true;
  }
  render() {
    const {
      id,
      mainImage,
      cropArea,
      realDimension,
      effects,
      active,
      labelRealDimension,
      labelImage
    } = this.props;

    return (
      <WithSliderDim active={active}>
        {dim => {
          if (dim.width === null) return null;
          const containerRatio = dim.width / dim.height; //parent
          const imageRatio = mainImage.width / mainImage.height; //current

          let css = {
            width: 0,
            height: 0,
            backgroundImage: "url(" + mainImage.src + ")"
          };
          let scale = 1;

          if (imageRatio < containerRatio) {
            scale = mainImage.height / dim.height;
            css = {
              ...css,
              width: mainImage.width / scale,
              height: dim.height
            };
          } else {
            scale = mainImage.width / dim.width;
            css = {
              ...css,
              width: dim.width,
              height: mainImage.height / scale
            };
          }

          const labelWidth =
            (labelRealDimension.width * cropArea.width) /
            realDimension.width /
            scale;

          const labelHeight =
            (labelRealDimension.height * cropArea.height) /
            realDimension.height /
            scale;

          const labelStyle = {
            backgroundSize: labelWidth + "px " + labelHeight + "px",
            backgroundImage: labelImage ? "url(" + labelImage + ")" : undefined
          };

          const effectsContainer = effects.map((effect, index) => {
            const effectCss = { backgroundImage: "url(" + effect + ")" };
            return (
              <div className="effectContainer" key={index} style={effectCss} />
            );
          });

          return (
            <React.Fragment>
              <div className="sliderItem" style={css}>
                <ItemLabel
                  {...cropArea}
                  scale={scale}
                  labelStyle={labelStyle}
                />
                {effectsContainer}
              </div>
            </React.Fragment>
          );
        }}
      </WithSliderDim>
    );
  }
}
module.exports = SliderItem;
