const React = require("react");

const WithSliderDim = require("../renderProps/withSliderDim");
const ItemLabel = require("./ItemLabel");

require("./sliderItem.css");

const sliderItem = props => {
  const {
    id,
    mainImage,
    cropArea,
    realDimension,
    effects,
    active,
    labelRealDimension,
    labelImage
  } = props;

  return (
    <WithSliderDim active={active}>
      {dim => {
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
          css = { ...css, width: dim.width, height: mainImage.height / scale };
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
              <ItemLabel {...cropArea} scale={scale} labelStyle={labelStyle} />
              {effectsContainer}
            </div>
          </React.Fragment>
        );
      }}
    </WithSliderDim>
  );
};

module.exports = sliderItem;
