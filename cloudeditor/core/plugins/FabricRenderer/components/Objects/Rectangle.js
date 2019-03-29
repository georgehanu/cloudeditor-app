const React = require("react");
const { connect } = require("react-redux");
const { fabric } = require("../../../../rewrites/fabric/fabric");

const { Rect } = require("../../fabric/index");

class Rectangle extends React.Component {
  render() {
    return <Rect {...this.props} />;
  }
}
module.exports = Rectangle;
