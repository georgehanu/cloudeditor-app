const React = require("react");
const { connect } = require("react-redux");
const {
  trimboxLinesSelector,
  bleedLinesSelector
} = require("../../../../stores/selectors/Html5/Boxes");
const BoxesLines = require("./BoxesLines");
require("./Boxes.css");

const Boxes = props => {
  let lines = null;
  const scale = props.scale;

  return (
    <React.Fragment>
      <BoxesLines
        type="trimbox"
        scale={props.scale}
        lines={props.trimboxLines}
      />
      <BoxesLines type="bleed" scale={props.scale} lines={props.bleedLines} />
    </React.Fragment>
  );
};
const mapStateToProps = state => {
  return {
    trimboxLines: trimboxLinesSelector(state),
    bleedLines: bleedLinesSelector(state)
  };
};

module.exports = connect(
  mapStateToProps,
  null
)(Boxes);
