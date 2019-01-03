const React = require("react");

const Base = require("./Base");

class Id extends React.Component {
  render() {
    let elem = <Base id={this.props.id} />;
    if (this.props.recurring) elem = <Ids ids={[1, 2, 4]} />;
    return elem;
  }
}

class Ids extends React.Component {
  render() {
    const elem = this.props.ids.map(function(id) {
      if (id === 3) return <Ids key={id} ids={[7, 88]} />;
      return <Id key={id} id={id} recurring={0} />;
    });
    return elem;
  }
}

module.exports = Ids;
