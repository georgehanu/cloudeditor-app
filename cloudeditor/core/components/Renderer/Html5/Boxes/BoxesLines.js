const React = require("react");
const BoxesLines = props => {
  let lines = null;
  const scale = props.scale;
  lines = props.lines.map((line, index) => {
    const style = {
      width: line.width == 1 ? line.width : line.width * scale,
      height: line.height == 1 ? line.height : line.height * scale,
      top: line.y * scale,
      left: line.x * scale
    };
    const uniqueKey = line.key;
    return (
      <div
        key={uniqueKey}
        style={style}
        className={["boxLine", props.type].join(" ")}
      />
    );
  });

  return <React.Fragment>{lines}</React.Fragment>;
};

module.exports = BoxesLines;
