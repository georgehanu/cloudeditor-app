const React = require("react");

class Base extends React.Component {
  render() {
    return this.props.id;
  }
}

module.exports = Base;
