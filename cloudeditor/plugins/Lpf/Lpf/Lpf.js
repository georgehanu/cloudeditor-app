const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");

require("./Lpf.css");

class Lpf extends React.Component {
  render() {
    return <div className="canvasContainer">Canvas</div>;
  }
}

const LpfPlugin = connect(
  null,
  null
)(withNamespaces("lpf")(Lpf));

module.exports = {
  LpfLpf: LpfPlugin
};
