const React = require("react");

const dummyText = props => {
  return (
    <div id={props.id} className={props.className} style={props.style}>
      {props.content}
    </div>
  );
};

module.exports = dummyText;
