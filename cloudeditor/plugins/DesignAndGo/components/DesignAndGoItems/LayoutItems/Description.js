const React = require("react");

const Types = require("../../DesignAndGoConfig/types");
const Text = require("./Text");

const Description = props => {
  const items = props.items.map((el, index) => {
    if (el.type === Types.TEXT) {
      return <Text key={index} {...el} />;
    }
  });
  return <React.Fragment>{items}</React.Fragment>;
};

module.exports = Description;
