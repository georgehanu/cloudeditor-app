const React = require("react");
const BackButton = require("./BackButton");
const posed = require("react-pose").default;

const Box = posed.div({
  visible: { right: -400 },
  hidden: { right: 0 }
});

const paneContainer = props => {
  const className =
    "paneContainer " + (props.visible ? "paneShow" : "paneHidden");
  return (
    <Box className={className} pose={props.visible ? "visible" : "hidden"}>
      <BackButton clicked={props.clicked} />
      {props.children}
    </Box>
  );
};

module.exports = paneContainer;

/*
 <Motion
      defaultStyle={{ x: rightMotion }}
      style={{ x: spring(rightMotion ) }}
      >
      {value => (
        <div className={className} style={{ right: value.x }}>
          <BackButton clicked={props.clicked} />
          {props.children}
        </div>
      )}
    </Motion>

*/
