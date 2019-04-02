const React = require("react");
const { connect } = require("react-redux");
const { withNamespaces } = require("react-i18next");

require("./Lpf.scss");

class Lpf extends React.Component {
  render() {
    return <div>123</div>;
  }
}

const LpfPlugin = connect(
  null,
  null
)(withNamespaces("lpf")(Lpf));

module.exports = {
  Lpf: LpfPlugin
};
