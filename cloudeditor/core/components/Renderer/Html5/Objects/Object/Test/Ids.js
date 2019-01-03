const React = require("react");

const Id = require("./Id");

class Ids extends React.Component {
  render() {
    const elem = this.props.ids.map(function(id) {
      if (id === 3) return <Id key={id} id={id} recurring={1} />;
      return <Id key={id} id={id} recurring={0} />;
    });
    return elem;
  }
}

module.exports = Ids;
