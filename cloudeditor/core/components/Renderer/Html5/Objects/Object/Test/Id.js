const React = require("react");

const Base = require("./Base");
const Ids = require("./Ids");

class Id extends React.Component {
  render() {
    let elem = <Base id={this.props.id} />;
    if (this.props.recurring) elem = <Ids ids={[1, 2, 4]} />;
    return elem;
  }
}

module.exports = Id;
